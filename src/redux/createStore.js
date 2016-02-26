import { createStore as _createStore } from 'redux';

import reducer from './modules/reducer';


export default function createStore(data) {
  const store = _createStore(reducer, data);

  /* global module, require */
  if (module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
