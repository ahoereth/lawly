import stringify from 'json-stable-stringify';


class Deferred {
  constructor() {
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
    const { type, id, val } = e.data;
    if (type !== 'response') { return; }
    this.promises[id].resolve(val);
    delete this.promises[id];
  }

  indexLaw(norms) {
    this.worker.postMessage({ cmd: 'indexLaw', args: [norms] });
  }

  search(query) {
    const msg = { cmd: 'search', args: [query] };
    const id = stringify(msg); // TODO: Hash instead of full json?
    this.worker.postMessage({ ...msg, id });
    this.promises[id] = new Deferred();
    return this.promises[id].promise;
  }
}


const localSearch = new LocalSearch();
export default localSearch;
