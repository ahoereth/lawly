import fetch from 'isomorphic-fetch';
import { batchActions } from 'redux-batched-actions';
import { isUndefined, omit, filter, uniq } from 'lodash';

import { setOnline } from '~/modules/core';
import { login } from '~/modules/user';
import { FETCH_SINGLE, getLaws } from '~/modules/laws';
import DataClient from './DataClient';
import localSearch from './LocalSearch';
import ApiError from './ApiError';
import { joinPath, parseJWT, obj2query } from './utils';


export default class ApiClient {
  static NO_CONNECTION_NO_CACHE = 'NO_CONNECTION_NO_CACHE';

  static jsonHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  static resources = {
    base: '/',
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
    this.online = false;
    this.storage = new DataClient();
    this.isNode = process.env.NODE_ENV === 'node';
    this.DEBUG = process.env.NODE_ENV === 'development';
  }

  init(store) {
    this.store = store;

    // Initialize authentication.
    this.storage.auth().then((token) => {
      if (!token) { return; }
      this.setAuthToken(token);
      const { payload } = parseJWT(token);
      this.store.dispatch(login(payload.email));
    });
  }

  isConnected(status = null) {
    if (status !== null) { // set
      if (this.online !== status) {
        this.store.dispatch(setOnline(status));
        clearInterval(this.networkCheck);
        if (status) {
          this.networkCheck = this.isNode || setInterval(
            () => this.fetch({ method: 'get', name: 'base' }),
            20000,
          );
        } else {
          this.networkCheck = this.isNode || setInterval(
            () => this.fetch({ method: 'get', name: 'base' }),
            2500,
          );
        }
      }

      this.online = status;

      if (this.online) {
        // Refire the earliest failed request if any. This triggers a loop
        // which will fire off all outstanding one by one.
        this.storage.popRequest().then((request) => {
          if (request) {
            this.fetch(request);
          }
        });
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

    return response.json().then((result) => {
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
   * TODO: Maybe just hit API if cached data is old/expired?
   *
   * @param  {string} url
   * @param  {object} options (optional)
   * @return {Promise}
   */
  fetch(options) {
    const {
      url, body, name, params, method, action, cachable,
    } = this.parseFetchOptions(options);

    const fetchRemote = (dispatch = false) => fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: {
        ...ApiClient.jsonHeaders,
        ...this.headers,
        ...options.headers,
      },
    }).then(res => this.parseResponse(res)).then((data) => {
      this.isConnected(true);
      if (cachable) {
        const expire = Date.now() + (1 * 24 * 60 * 60 * 1000); // TOMORROW
        this.storage.stash({ name, method, ...params }, { expire, data });
      }

      if (dispatch) {
        this.store.dispatch({ type: action, payload: data });
      }

      return data;
    }).catch((err) => {
      if (err.name !== 'ApiError') {
        this.storage.stashRequest(options)
          .then(() => this.isConnected(false));
      }

      if (this.DEBUG) { // eslint-disable-next-line no-console
        console.err('Could not fetch:', this.parseFetchOptions(options));
        throw err;
      } else { // eslint-disable-next-line no-console
        console.warn('Could not fetch from remote:', name, params);
      }
    });

    if (cachable) {
      return this.storage.get({ name, method, ...params }).then((cache) => {
        if (Date.now() > cache.expire) {
          fetchRemote(true); // Update cache and dispatch fresh data.
        }

        return cache.data;
      }).catch(() => fetchRemote());
    }

    return fetchRemote();
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
      .catch((err) => {
        if (err.name === 'ApiError') {
          this.unauth(email, { localOnly: true });
          throw err;
        } else {
          return this.storage.get(email).catch((err) => {
            this.unauth(email, true);
            throw err;
          });
        }
      })
      .then((result) => {
        // Fetch all starred laws and insert them into the redux store.
        const groupkeys = uniq(result.laws.map(law => law.groupkey));
        Promise.all(groupkeys.map(groupkey => (
          this.get({ name: 'law', groupkey, cachable: true })
        ))).then(laws => this.store.dispatch(batchActions(
          laws.map(payload => ({ type: FETCH_SINGLE, payload })),
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
  unauth(email, { localOnly = false, deleteUser = false }) {
    const resource = deleteUser ? 'users' : 'user_sessions';
    const req = !localOnly ? this.remove({ name: resource, email })
                           : Promise.resolve();
    this.storage.remove(email);
    this.setAuthToken();
    return req;
  }

  /**
   * Unified search handler. Wraps remote and local search -- provides results
   * from whichever is available, prefering the former.
   *
   * @param  {string} query
   * @return {Promise}
   */
  search(query) {
    if (!query) {
      return Promise.resolve({ total: null, results: null });
    }

    return this.get({ name: 'laws', search: query }).catch(() => {
      const laws = getLaws(this.store.getState());
      return localSearch.search(query, { laws, limit: 100 });
    });
  }
}
