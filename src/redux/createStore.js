import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware, } from 'react-router-redux';
import Immutable from 'immutable';

import functionsMiddleware from './middlewares/functionsMiddleware';
import promiseMiddleware from './middlewares/promiseMiddleware';
import fetchMiddleware from './middlewares/fetchMiddleware';
import reducer from './modules/reducer';


/* global window */
export default function createStore(client, data = {}) {
  const middlewares = [
    functionsMiddleware(),
    promiseMiddleware(client),
    fetchMiddleware(client),
    routerMiddleware(browserHistory),
  ];
  const finalCreateStore = compose(
    applyMiddleware(...middlewares),
    window && window.devToolsExtension ? window.devToolsExtension() : f => f
  )(_createStore);
  const store = finalCreateStore(reducer, Immutable.fromJS(data));

  client.init(store);

  /* global module, require */
  if (module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
