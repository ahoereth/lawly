import localforage from 'localforage/src/localforage';

export default class DataClient {
  static options = {
    name: 'lawly',
    version: 1.0,
    size: 50*1024*1024,
  };

  constructor() {
    this.forage = localforage.createInstance(DataClient.options);
  }

  stashRequest(request) {
    return this.forage.getItem('requests').then(requests =>
      this.forage.setItem('requests', (requests || []).concat([request]))
    );
  }

  popRequest() {
    return this.forage.getItem('requests').then(requests => {
      if (!Array.isArray(requests) || !requests.length) { return undefined; }
      return this.forage.setItem('requests', requests.slice(1))
                        .then(() => requests[0]);
    });
  }
}
