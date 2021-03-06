import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import Immutable from 'immutable';
import createDebounce from 'redux-debounced';
import { enableBatching } from 'redux-batched-actions';
import { isUndefined as isUndef } from 'lodash';

import rootReducer from '~/modules';
import {
  functionsMiddleware,
  apiMiddleware,
  promiseMiddleware,
  fetchMiddleware,
} from './middlewares';

export default function createStore(history, client, data = {}) {
  const middlewares = [
    createDebounce(),
    functionsMiddleware(),
    apiMiddleware(client),
    promiseMiddleware(client),
    fetchMiddleware(client),
    routerMiddleware(history),
  ];

  let devToolsExtension = f => f;
  if (!isUndef(global.window) && !isUndef(global.window.devToolsExtension)) {
    devToolsExtension = global.window.devToolsExtension();
  }

  const store = _createStore(
    enableBatching(rootReducer),
    Immutable.fromJS(data),
    compose(applyMiddleware(...middlewares), devToolsExtension),
  );

  client.init(store);

  /* global module */
  if (module.hot) {
    module.hot.accept('~/modules', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
