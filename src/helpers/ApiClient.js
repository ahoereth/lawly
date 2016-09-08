import fetch from 'isomorphic-fetch';
import { batchActions } from 'redux-batched-actions';
import { isUndefined, omit, filter, uniq } from 'lodash';

import DataClient from './DataClient';
import localSearch from './LocalSearch';
import ApiError from './ApiError';
import { joinPath, parseJWT, obj2query } from './utils';
import { login } from '~/modules/user';
import { FETCH_SINGLE, getLaws } from '~/modules/laws';


export default class ApiClient {
  static NO_CONNECTION_NO_CACHE = 'NO_CONNECTION_NO_CACHE';

  static jsonHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  static resources = {
    laws: '/laws',
    law: '/laws/:groupkey',
    users: '/users/:email',
    user_sessions: '/users/:email/sessions',
    user_law: '/users/:email/laws/:groupkey/:enumeration',
  };

  static defaultParams = {
    email: '~',
  };

  constructor(apiurl) {
    this.headers = {};
    this.apiurl = apiurl;
    this.online = true;
    this.storage = new DataClient();
  }

  init(store) {
    this.store = store;

    // Initialize authentication.
    this.storage.auth().then(token => {
      if (!token) { return; }
      this.setAuthToken(token);
      const { payload } = parseJWT(token);
      this.store.dispatch(login(payload.email));
    });
  }

  isConnected(status = null) {
    if (status !== null) {
      this.online = status; // set

      if (this.online) {
        // TODO: Stop testing network frequently.

        // Refire the earliest failed request if any. This triggers a loop
        // which will fire off all outstanding one by one.
        this.storage.popRequest().then(request => {
          if (request) {
            this.fetch(request);
          }
        });
      } else {
        // TODO: Start testing network connection frequently.
      }
    }

    return this.online; // get
  }

  /**
   * Compiles an API url required for firing off a request.
   *
   * TODO: Consider making it possible to have params and body in a single
   * object which is splitted into the two by this function.
   *
   * @param  {string/object} resource
   * @param  {object}        query (optional)
   * @return {string}
   */
  parseFetchOptions({ method, name, action, cachable = false, ...payload }) {
    const skeleton = ApiClient.resources[name];
    const values = { ...ApiClient.defaultParams, ...payload };
    const params = {};
    let path = skeleton.replace(/:(\w+)/g, (match, key) => {
      params[key] = values[key];
      return !isUndefined(values[key]) ? encodeURIComponent(values[key]) : '';
    });

    const body = omit(payload, Object.keys(params));
    if ((method || '').toLowerCase() === 'get') {
      path += obj2query(body, true);
    }

    return {
      method, name, action, cachable,
      params: filter(params, x => !isUndefined(x)),
      url: joinPath(this.apiurl, path),
      body: method !== 'get' ? body : undefined,
    };
  }


  /**
   * Sets the authorization header used in all future requests and saves the
   * JWT to local storage in order to recover it in future sessions. If some
   * falsey value is passed the header is removed and the old token deleted.
   *
   * @param {string} token
   */
  setAuthToken(token = null) {
    this.headers.authorization = token ? `JWT ${token}` : undefined;
    this.storage.auth(token);
  }

  /**
   * All responses contain a JSON object surrounding the actual response
   * **data** (*optional*, `object`) with additional information like the
   * **status** (*required*, `success|fail|error`), a
   * **message** (*optional*, `string`) and a renewed JSON Web Token
   * **token** (*optional*, `string`) to replace the old one.
   *
   * @param  {Response} res
   * @return {Promise}
   */
  parseResponse(response) {
    const type = response.headers.get('content-type');
    if (type.indexOf('application/json') === -1) {
      // We should not end up here. All responses should be JSON!
      return response.text();
    }

    return response.json().then(result => {
      const { status, message, data, token } = result;

      if (!status) {
        // Seems like we just received the raw data, unwrapped.
        return result;
      }

      // Refresh token if one is provided.
      if (token) { this.setAuthToken(token); }

      // Handle response accordingly to status.
      switch (status) {
        case 'success':
          return data;
        case 'error':
        case 'fail':
        default:
          // eslint-disable-next-line no-console
          console.warn('Rejected by server', message || response.statusText);
          throw new ApiError(message || response.statusText);
      }
    });
  }

  /**
   * Wrapper around the fetch api for smoother response handling.
   *
   * @param  {string} url
   * @param  {object} options (optional)
   * @return {Promise}
   */
  fetch(options) {
    const {
      url, body, name, params, method, action, cachable,
    } = this.parseFetchOptions(options);

    let expired = true;
    let cache = Promise.resolve();

    if (cachable) {
      cache = this.storage.get({ name, method, ...params }).then(cached => {
        if (cached) {
          const { data = cached, expire } = cached;
          expired = expire && expire < Date.now();
          if (action) {
            this.store.dispatch({ type: action, payload: data });
          }

          return cached.data;
        }

        return undefined;
      });
    }

    let request = cache.then(cachedResult => {
      if (!cachedResult || expired) {
        return fetch(url, {
          method,
          body: JSON.stringify(body),
          headers: {
            ...ApiClient.jsonHeaders,
            ...this.headers,
            ...options.headers,
          },
        });
      }

      throw new Error('FROM_CACHE');
    });


    // Server responded.
    request = request.then(res => {
      this.isConnected(true);
      // if (!this.isConnected()) {
      // // TODO: Here not only the connection status is updated, but
      // // additionally the current triggering request performed again.
      // // Reasoning is, that one of the previously stashed requests
      // // might undo the triggering one which is undesired behavior.
      // this.storage.stashRequest(options).then(() => this.isConnected(true));
      // } else {
      //   this.isConnected(true);
      // }

      // Got raw data, probably from cache.
      if (!res.headers || !res.headers.get('content-type')) {
        return res;
      }

      // Fresh response, need to parse it.
      return this.parseResponse(res).then(data => {
        if (cachable) {
          const expire = Date.now() + (1 * 24 * 60 * 60 * 1000); // TOMORROW
          this.storage.stash({ name, method, ...params }, { expire, data });
        }
        return data;
      });
    });

    // Network error.
    request = request.catch(err => {
      if (err.message === 'FROM_CACHE') {
        return cache;
      }

      if (err.name !== 'ApiError' && !cachable) {
        // Seemingly a network error. Stash to retry later if its not cachable.
        this.storage.stashRequest(options).then(() => this.isConnected(false));
      }

      if (cachable) {
        return this.storage.get({ name, method, ...params });
      }

      throw err;
    });

    // If the request has an action type attached dispatch that action.
    if (action) {
      // If the request is cachable answer using the cache right away, but do
      // not overwrite the API result if its back first.
      if (cachable) {
        const pairedRequest = new Promise(resolve => {
          let remoteRequestFinished = false;

          this.storage.get({ name, method, ...params }).then(cached => {
            if (cached && !remoteRequestFinished) {
              resolve(this.store.dispatch({ type: action, payload: cached }));
            }
          });

          request.then(remote => {
            remoteRequestFinished = true;
            resolve(this.store.dispatch({ type: action, payload: remote }));
          });
        });
        request = pairedRequest;
      } else {
        request = request.then(result =>
          this.store.dispatch({ type: action, payload: result })
        );
      }
    }

    return request;
  }

  /**
   * Wrapper around fetch for quick get requests to our api.
   *
   * @param  {string} resource
   * @return {Promise}
   */
  get(resource) {
    return this.fetch({ ...resource, method: 'get' });
  }

  /**
   * Wrapper around fetch for quick post requests to the api.
   *
   * @param  {url} resource
   * @param  {object} data
   * @return {Promise}
   */
  post(resource) {
    return this.fetch({ ...resource, method: 'post' });
  }

  /**
   * Wrapper around fetch for quick put requests to the api.
   *
   * @param  {url} resource
   * @param  {object} data
   * @return {Promise}
   */
  put(resource) {
    return this.fetch({ ...resource, method: 'put' });
  }

  /**
   * Wrapper around fetch for quick delete requests to the api.
   *
   * @param  {url} resource
   * @param  {object} data
   * @return {Promise}
   */
  remove(resource) {
    return this.fetch({ ...resource, method: 'delete' });
  }

  /**
   * Wrapper around the post function for smoothly handling retrieving and
   * integrating a new authentication token.
   *
   * @param  {string} email
   * @param  {string} password
   * @return {Promise}
   */
  auth(email, password = undefined, signup = false) {
    return this.post({ name: 'users', email, password, signup })
      .then(result => this.storage.stash(email, result))
      .catch(err => {
        if (err.name === 'ApiError') {
          this.unauth(email);
          throw err;
        } else {
          return this.storage.get(email).then(cachedUser => {
            if (!cachedUser) {
              this.unauth(email);
              return Promise.reject();
            }

            return cachedUser;
          });
        }
      })
      .then(result => {
        // Fetch all starred laws and insert them into the redux store.
        const groupkeys = uniq(result.laws.map(law => law.groupkey));
        Promise.all(groupkeys.map(groupkey => (
          this.get({ name: 'law', groupkey, cachable: true })
        ))).then(laws => this.store.dispatch(batchActions(
          laws.map(payload => ({ type: FETCH_SINGLE, payload }))
        )));

        return result;
      });
  }

  /**
   * Wrapper around the remove function for not only destroying the session
   * on the server side but also client side.
   *
   * @param  {string} email
   * @return {Promise}
   */
  unauth(email) {
    this.setAuthToken();
    this.storage.remove(email);
    return this.remove({ name: 'user_sessions', email });
  }

  /**
   * Unified search handler. Wraps remote and local search -- provides results
   * from whichever is available, prefering the former.
   *
   * @param  {string} query
   * @return {Promise}
   */
  search(query) {
    return this.get({ name: 'laws', search: query }).catch(() => {
      const laws = getLaws(this.store.getState());
      return localSearch.search(query, { laws, limit: 100 });
    });
  }
}
