import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import Immutable from 'immutable';
import createDebounce from 'redux-debounced';
import { isUndefined as isUndef } from 'lodash';

import rootReducer from '~/modules';
import { renderShells } from '~/modules/shells';
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

  const finalCreateStore = compose(
    applyMiddleware(...middlewares),
    devToolsExtension
  )(_createStore);
  const store = finalCreateStore(rootReducer, Immutable.fromJS(data));
  store.dispatch(renderShells(false)); // Turn shell-only rendering off ASAP.

  client.init(store);

  /* global module */
  if (module.hot) {
    module.hot.accept('~/modules', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
