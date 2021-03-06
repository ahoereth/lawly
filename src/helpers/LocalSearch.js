import stringify from 'json-stable-stringify';

import getWorker from './WorkerShim';

class Deferred {
  constructor(data) {
    this.data = data;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

class LocalSearch {
  static fields = ['groupkey', 'title', 'body'];

  static parseResult({ result, laws, limit = result.length }) {
    // Currently parsing the result outside of the web worker because
    // sending the required laws to the worker is expensive.
    return {
      total: limit > result.length ? result.length : limit,
      results: result.slice(0, limit).map(obj => {
        const [k, n] = obj.ref.split('::');
        return {
          groupkey: k,
          enumeration: n,
          title: laws
            .get(k)
            .find(l => l.get('enumeration') === n)
            .get('title'),
        };
      }),
    };
  }

  constructor() {
    this.worker = getWorker();
    this.promises = {};
    this.worker.onmessage = e => this.messageHandler(e);
  }

  messageHandler(e) {
    const { type = 'request', cmd, id, val } = e.data;
    switch (type) {
      case 'request':
        break;
      case 'response':
        switch (cmd) {
          case 'search':
            this.promises[id].resolve(
              LocalSearch.parseResult({
                result: val,
                ...this.promises[id].data,
              }),
            );
            delete this.promises[id];
            break;
          default:
            throw new Error('Unexpected LocalSearch command');
        }
        break;
      case 'log':
      default:
        /* eslint-disable no-console */
        console.log('worker log', val);
        break;
    }
  }

  indexLaw(norms) {
    this.worker.postMessage({ cmd: 'indexLaw', args: [norms] });
  }

  search(query, data) {
    const msg = { type: 'request', cmd: 'search', args: [query] };
    const id = stringify(msg); // TODO: Hash instead of full json?
    this.promises[id] = new Deferred(data);
    this.worker.postMessage({ ...msg, id });
    return this.promises[id].promise;
  }
}

const localSearch = new LocalSearch();
export default localSearch;
