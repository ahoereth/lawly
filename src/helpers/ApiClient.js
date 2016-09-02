import fetch from 'isomorphic-fetch';
import { isUndefined, isPlainObject, isError, omit } from 'lodash';

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
      method, name, action, cachable, params,
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

    let request = fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: {
        ...ApiClient.jsonHeaders,
        ...this.headers,
        ...options.headers,
      },
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
      return this.parseResponse(res).then(result => {
        if (cachable) {
          this.storage.stash({ name, method, ...params }, result);
        }
        return result;
      });
    });

    // Network error.
    request = request.catch(err => {
      if (err.name !== 'ApiError') {
        // Seemingly a network error. Stash to retry later.
        this.storage.stashRequest(options).then(() => this.isConnected(false));
      }

      if (cachable) {
        return this.storage.get({ name, method, ...params });
      }

      throw err;
    });

    // If the request has an action type attached dispatch that action here.
    if (action) {
      return request.then(
        result => this.store.dispatch({ type: action, payload: result }),
        err => {
          if (err === ApiClient.NO_CONNECTION_NO_CACHE) return true;
          return this.store.dispatch({
            type: action,
            error: true,
            payload: isError(err) ? err.toString() : err,
          });
        }
      );
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
          return this.storage.get(email);
        }
      })
      .then(result => {
        // Fetch all starred laws in a single request and insert them into the
        // redux store. TODO: This logic chunk does not really belong here.
        this.get({ name: 'law', groupkey: result.laws.map(l => l.groupkey) })
          .then(laws => (
            !isPlainObject(laws) ? { [laws[0].groupkey]: laws } : laws
          ))
          .then(laws => Object.keys(laws).forEach(groupkey => {
            const law = laws[groupkey];
            this.storage.stash({ method: 'get', name: 'law', groupkey }, law);
            this.store.dispatch({ type: FETCH_SINGLE, payload: law });
          }));
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
