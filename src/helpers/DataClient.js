import localforage from 'localforage/src/localforage';
import stringify from 'json-stable-stringify';


export default class DataClient {
  static options = {
    name: 'lawly',
    version: 1.0,
    size: 50*1024*1024,
  };

  constructor() {
    this.forage = localforage.createInstance(DataClient.options);
  }

  stash(key, data) {
    return this.forage.setItem(stringify(key), data);
  }

  get(key) {
    return this.forage.getItem(stringify(key));
  }

  auth(token = undefined) {
    if (token === null) { // Unset token.
      return this.forage.removeItem('auth');
    } else if (typeof token !== 'undefined') { // Set token.
      return this.forage.setItem('auth', token);
    } else { // Get token.
      return this.forage.getItem('auth');
    }
  }

  stashRequest(request) {
    return this.forage.getItem('requests').then(requests => {
      const reqStr = stringify(request);
      requests = (requests || []).filter(req => stringify(req) === reqStr)
                                 .concat([request]);

      return this.forage.setItem('requests', requests);
    });
  }

  popRequest() {
    return this.forage.getItem('requests').then(requests => {
      if (!Array.isArray(requests) || !requests.length) { return undefined; }
      return this.forage.setItem('requests', requests.slice(1))
                        .then(() => requests[0]);
    });
  }
}