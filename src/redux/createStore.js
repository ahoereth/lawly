import { createStore as _createStore, applyMiddleware } from 'redux';

import fetchMiddleware from './middleware/fetchMiddleware';
import reducer from './modules/reducer';


export default function createStore(client, data) {
  const middlewares = [fetchMiddleware(client)];
  const finalCreateStore = applyMiddleware(...middlewares)(_createStore);
  const store = finalCreateStore(reducer, data);

  /* global module, require */
  if (module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
