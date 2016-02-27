import { createStore as _createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware, } from 'react-router-redux';

import fetchMiddleware from './middleware/fetchMiddleware';
import reducer from './modules/reducer';


export default function createStore(client, data) {
  const middlewares = [
    fetchMiddleware(client),
    routerMiddleware(browserHistory),
  ];
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
