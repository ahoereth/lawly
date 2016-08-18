import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import Immutable from 'immutable';
import createDebounce from 'redux-debounced';

import rootReducer from './rootReducer';
import {
  functionsMiddleware,
  apiMiddleware,
  promiseMiddleware,
  fetchMiddleware,
} from './middlewares';


/* global window */
export default function createStore(client, data = {}) {
  const middlewares = [
    createDebounce(),
    functionsMiddleware(),
    apiMiddleware(client),
    promiseMiddleware(client),
    fetchMiddleware(client),
    routerMiddleware(browserHistory),
  ];
  const finalCreateStore = compose(
    applyMiddleware(...middlewares),
    window && window.devToolsExtension ? window.devToolsExtension() : f => f
  )(_createStore);
  const store = finalCreateStore(rootReducer, Immutable.fromJS(data));

  client.init(store);

  /* global module */
  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
