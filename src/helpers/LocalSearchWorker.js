import elasticlunr from 'elasticlunr';

import { isObject } from 'helpers/utils';


/* global self */
const worker = self;


// function log(...val) {
//   val = val.length === 1 ? val[0] : val;
//   worker.postMessage({ type: 'log', val });
// }


class LocalSearchWorker {
  static fields = [
    'groupkey',
    'title',
    'body',
  ];

  static trimmer(token) {
    if (token === null || token === undefined) {
      throw new Error('token should not be undefined');
    }

    // [^\w§] substitution for \W -- currently ignoring - and _
    return token.replace(/^[^\w§]+/, '').replace(/[^\w§]+$/, '');
  }

  constructor() {
    elasticlunr.Pipeline.registerFunction(LocalSearchWorker.trimmer, 'trim');
    const oldTrimmer = elasticlunr.Pipeline.getRegisteredFunction('trimmer');
    const newTrimmer = elasticlunr.Pipeline.getRegisteredFunction('trim');

    // TODO: Index should be stored in forage because it's creation is expensive.
    this.index = elasticlunr(function() {
      this.addField('groupkey');
      this.addField('title');
      this.addField('body');
      this.setRef('id');
      this.saveDocument(false);
    });

    this.index.pipeline.before(oldTrimmer, newTrimmer);
    this.index.pipeline.remove(oldTrimmer);

    this.index.saveDocument(false);
  }

  indexLaw(norms) {
    if (isObject(norms)) {
      norms = Object.keys(norms).reduce((list, key) => {
        return list.concat(norms[key]);
      }, []);
    }

    norms.forEach(norm => this.index.addDoc({
      ...norm, id: norm.groupkey + '::' + norm.enumeration
    }, false));
  }

  search(query) {
    return this.index.search(query, {
      fields: {
        groupkey: { boost: 10, expand: true  },
        title: { boost: 1, expand: true },
        body: { boost: 1, expand: true  },
      }
    });
  }
}


const search = new LocalSearchWorker();


worker.onmessage = function(e) {
  const { type, id, cmd, args } = e.data;
  if (type === 'response') { return; }
  const val = search[cmd](...args);
  if (id) {
    worker.postMessage({ type: 'response', id, val });
  }
};
