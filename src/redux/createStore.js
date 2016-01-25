import { createStore as _createStore, applyMiddleware } from 'redux';
import { syncHistory } from 'react-router-redux';

import reducer from './modules/reducer';


export default function createStore(history, data) {
  const createStoreWithMiddleware = applyMiddleware(
    syncHistory(history)
  )(_createStore);
  const store = createStoreWithMiddleware(reducer, data);

  /* global module, require */
  if (module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
