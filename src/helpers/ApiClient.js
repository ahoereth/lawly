import fetch from 'isomorphic-fetch';

import { startsWith, endsWith } from './utils';


function obj2query(obj = null) {
  if (!obj) { return ''; }
  let str = '';
  for (let key in obj) {
    if (str !== '') { str += '&'; }
    str += key + '=' + encodeURIComponent(obj[key]);
  }
  return str;
}


function getRequestUrl(base, path, query = {}) {
  if (!endsWith(base, '/') && !startsWith(path, '/')) {
    base += '/';
  }

  if (path.indexOf('?') === '-1') {
    path += '?';
  }

  return base + path + obj2query(query);
}


function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}


function getBody(response) {
  const type = response.headers.get('content-type');
  if (startsWith(type, 'application/json')) {
    return response.json();
  } else {
    return response.text();
  }
}


export default class ApiClient {
  constructor(apiurl) {
    this.headers = {};
    this.apiurl = apiurl;

    /* global window */
    if (window && window.localStorage) {
      // Recover authentication from last session.
      const token = window.localStorage.getItem('auth');
      if (token) { this.setAuthToken(token); }
    }
  }

  /**
   * Sets the authorization header used in all future requests and saves the
   * JWT to local storage in order to recover it in future sessions. If some
   * falsey value is passed the header is removed and the old token deleted.
   *
   * @param {string} token
   */
  setAuthToken(token) {
    this.headers.Authorization =  token ? `JWT ${token}` : undefined;

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
   * Wrapper around the fetch api for smoother response handling.
   *
   * @param  {string} url
   * @param  {object} options (optional)
   * @return {Promise}
   */
  fetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(checkStatus).then(getBody).then(resolve)
        .catch(error => reject(error.toString()));
    });
  }

  /**
   * Wrapper around fetch for quick get requests to our api.
   *
   * @param  {string} resource
   * @return {Promise}
   */
  get(resource) {
    return this.fetch(getRequestUrl(this.apiurl, resource), {
      method: 'get',
      headers: this.headers,
    });
  }

  /**
   * Wrapper around fetch for quick post requests to our api. Handles setting
   * the correct headers and converting the payload to json.
   *
   * @param  {url} resource
   * @param  {object} data
   * @return {Promise}
   */
  post(resource, data) {
    return this.fetch(getRequestUrl(this.apiurl, resource), {
      method: 'post',
      headers: { ...this.headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
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
  auth(email, password) {
    return this.post('user/authenticate', { email, password }).then(
      ({ email, token }) => {
        this.setAuthToken(token);
        return { email };
      }
    );
  }

}
