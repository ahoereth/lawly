import fetch from 'isomorphic-fetch';

import { startsWith, endsWith } from './utils';


function obj2query(obj = null) {
  if (!obj) { return ''; }
  var str = '';
  for (var key in obj) {
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
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}


function getBody(response) {
  const type = response.headers.get('content-type');
  if (type.slice(0, 16) === 'application/json') {
    return response.json();
  } else {
    return response.text();
  }
}


export default class ApiClient {
  constructor(apiurl) {
    this.apiurl = apiurl;
  }

  get(resource) {
    return new Promise((resolve, reject) => {
      fetch(getRequestUrl(this.apiurl, resource))
        .then(checkStatus).then(getBody).then(resolve)
        .catch(error => reject(error.toString()));
    });
  }
}
