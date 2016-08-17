import elasticlunr from 'elasticlunr';
import { isPlainObject } from 'lodash';


export default class LocalSearchWorker {
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

    // TODO: Index should be stored in forage because it's creation is expensive
    this.index = elasticlunr(function () {
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
    let normsList = norms;
    if (isPlainObject(normsList)) {
      normsList = Object.keys(norms).reduce((list, key) => (
        list.concat(norms[key])
      ), []);
    }

    normsList.forEach(norm => this.index.addDoc({
      ...norm, id: `${norm.groupkey}::${norm.enumeration}`,
    }, false));
  }

  search(query) {
    return this.index.search(query, {
      fields: {
        groupkey: { boost: 10, expand: true },
        title: { boost: 1, expand: true },
        body: { boost: 1, expand: true },
      },
    });
  }
}
