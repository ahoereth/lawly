import fetch from 'isomorphic-fetch';

import { login } from 'redux/modules/user';
import {
  isUndefined, isObject, startsWith,
  joinPath, parseJWT, obj2query
} from './utils';


export default class ApiClient {
  static jsonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  static resources = {
    'users': '/users',
    'user_sessions': '/users/:email/sessions',
    'laws': '/laws',
    'law': '/laws/:groupkey',
  };

  constructor(apiurl) {
    this.headers = {};
    this.apiurl = apiurl;
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

  /**
   * Compiles an API url required for firing off a request.
   *
   * @param  {string/object} resource
   * @param  {object}        query (optional)
   * @return {string}
   */
  getRequestUrl(resource, query = null) {
    let path = resource;
    if (isObject(resource)) {
      const pattern = ApiClient.resources[resource.name];
      path = pattern.replace(/:(\w+)/g, (match, key) => {
        return !isUndefined(resource[key]) ? encodeURIComponent(resource[key])
                                           : match;
      });
    }

    path = joinPath(this.apiurl, path);
    if (query && path.indexOf('?') === '-1') { path += '?'; }
    return path + obj2query(query);
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
          throw (message || response.statusText);
        case 'fail':
          throw message;
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
  fetch(resource, options = {}) {
    return fetch(this.getRequestUrl(resource), options)
      .then(res => this.parseResponse(res));
  }

  /**
   * Wrapper around fetch for quick get requests to our api.
   *
   * @param  {string} resource
   * @return {Promise}
   */
  get(resource) {
    return this.fetch(resource, {
      method: 'get',
      headers: this.headers,
    });
  }

  /**
   * Wrapper around fetch for quick post requests to the api.
   *
   * @param  {url} resource
   * @param  {object} data
   * @return {Promise}
   */
  post(resource, data) {
    return this.fetch(resource, {
      method: 'post',
      headers: { ...ApiClient.jsonHeaders, ...this.headers },
      body: JSON.stringify(data)
    });
  }

  /**
   * Wrapper around fetch for quick delete requests to the api.
   *
   * @param  {url} resource
   * @param  {object} data
   * @return {Promise}
   */
  remove(resource, data) {
    return this.fetch(resource, {
      method: 'delete',
      headers: { ...ApiClient.jsonHeaders, ...this.headers },
      body: JSON.stringify(data)
    });
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
    const resource = signup ? { name: 'users' }
                            : { name: 'user_sessions', email };
    return this.post(resource, { email, password });
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
      .then(() => this.setAuthToken());
  }
}
