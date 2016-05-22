import fetch from 'isomorphic-fetch';

import DataClient from './DataClient';
import { login } from 'redux/modules/user';
import {
  isUndefined, startsWith,
  joinPath, parseJWT, obj2query, omit,
} from './utils';


export default class ApiClient {
  static jsonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  static resources = {
    'laws': '/laws',
    'law': '/laws/:groupkey',
    'users': '/users/:email',
    'user_sessions': '/users/:email/sessions',
    'user_law': '/users/:email/laws/:groupkey/:enumeration',
  };

  static defaultParams = {
    email: '~',
  }

  constructor(apiurl) {
    this.headers = {};
    this.apiurl = apiurl;
    this.online = false;
    this.storage = new DataClient();
  }

  init(store) {
    this.store = store;

    /* global window */
    if (window && window.localStorage) {
      // Recover authentication from last session.
      const token = window.localStorage.getItem('auth');
      if (token) {
        this.setAuthToken(token);
        const { payload } = parseJWT(token);
        this.store.dispatch(login(payload.email));
      }
    }
  }

  isConnected(status = null) {
    if (status !== null) { // status change
      this.online = status; // set

      if (this.online) {
        // TODO: Stop testing network frequently.

        // Refire the earliest failed request if any. This triggers a loop
        // which will fire off all outstanding one by one.
        this.storage.popRequest().then(request => {
          if (request) { this.fetch(request); }
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
  parseFetchOptions(options) {
    const { method, name, action, ...payload } = options;

    const skeleton = ApiClient.resources[name];
    const values = { ...ApiClient.defaultParams, ...payload };
    let params = [];
    let path = skeleton.replace(/:(\w+)/g, (match, key) => {
      params.push(match);
      return !isUndefined(values[key]) ? encodeURIComponent(values[key]) : '';
    });

    const body = omit(payload, ...params);
    if ((method || '').toLowerCase() === 'get') {
      path = path + obj2query(body);
    }

    return {
      method: method, action: action,
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
  setAuthToken(token) {
    this.headers.authorization = token ? `JWT ${token}` : undefined;

    /* global window */
    if (window && window.localStorage) {
      if (token) {
        // Save token to local storage for future sessions.
        window.localStorage.setItem('auth', token);
      } else {
        // Remove token from local storage.
        window.localStorage.removeItem('auth');
      }
    }
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
    if (!startsWith(type, 'application/json')) {
      // We should not end up here. All responses should be JSON!
      return response.text();
    }

    return response.json().then(result => {
      const { status, message, data, token } = result;
      if (!status) { // We just received the data, its not wrapped as expected.
        return result;
      }

      // Refresh token if one is provided.
      if (token) { this.setAuthToken(token); }

      // Handle response accordingly to status.
      switch (status) {
        case 'error':
        case 'fail':
          throw (message || response.statusText);
        case 'success':
          return data;
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
    const { url, body, method, action } = this.parseFetchOptions(options);
    const request = fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: {...ApiClient.jsonHeaders, ...this.headers, ...options.headers },
    })
      .then(res => { // Server responded.
        if (!this.isConnected()) {
          // TODO: Here not only the connection status is updated, but
          // additionally the current triggering request performed again.
          // Reasoning is, that one of the previously stashed requests
          // might undo the triggering one which is undesired behavior.
          this.storage.stashRequest(options).then(() => this.isConnected(true));
        }
        return this.parseResponse(res);
      }, (/* err */) => { // Network error.
        this.isConnected(false);
        throw 'break';
      });

    // If the request has an action type attached dispatch that action here.
    if (action) {
      return request
        .then(result => this.store.dispatch({
          type: action,
          payload: result,
        }))
        .catch(err => {
          if (err === 'break') { return; }
          this.store.dispatch({
            type: action,
            error: true,
            payload: err instanceof Error ? err.toString() : err,
          });
        });
    } else {
      return request;
    }
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
   * Wrapper around the post function for smoothly handling retrieving and
   * integrating a new authentication token.
   *
   * @param  {string} email
   * @param  {string} password
   * @return {Promise}
   */
  auth(email, password = undefined, signup = false) {
    return this.post({ name: 'users', email, password, signup });
  }

  /**
   * Wrapper around the remove function for not only destroying the session
   * on the server side but also client side.
   *
   * @param  {string} email
   * @return {Promise}
   */
  unauth(email) {
    return this.remove({ name: 'user_sessions', email })
      .then(response => {
        this.setAuthToken();
        return response;
      });
  }
}
