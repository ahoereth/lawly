import stringify from 'json-stable-stringify';


class Deferred {
  constructor(data) {
    this.data = data;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject  = reject;
    });
  }
}


class LocalSearch {
  static fields = [
    'groupkey',
    'title',
    'body',
  ];

  constructor() {
    /* global Worker */
    this.worker = new Worker('/worker.js');
    this.promises = {};
    this.worker.onmessage = e => this.messageHandler(e);

    /* global window, DEBUG */
    DEBUG && (window.work = this.worker);
  }

  messageHandler(e) {
    const { type, cmd, id, val } = e.data;
    switch (type) {
      case 'request':
        break;
      case 'response':
        switch (cmd) {
          case 'search':
            this.promises[id].resolve(
              this.parseResult({ result: val, ...this.promises[id].data })
            );
            delete this.promises[id];
            break;
        }
        break;
      case 'log':
        console.log('worker log', val);
        break;
    }
  }

  indexLaw(norms) {
    this.worker.postMessage({ cmd: 'indexLaw', args: [norms] });
  }

  parseResult({ result, laws, limit }) {
    // Currently parsing the result outside of the web worker because
    // sending the required laws to the worker is expensive.
    return {
      total: result.length,
      results: result.slice(0, limit || result.length).map(obj => {
        const [k, n] = obj.ref.split('::');
        return {
          groupkey: k, enumeration: n,
          title: laws.get(k).find(l => l.get('enumeration') === n).get('title')
        };
      }),
    };
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
