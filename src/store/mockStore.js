import chai from 'chai';
import spies from 'chai-spies';
import configureMockStore from 'redux-mock-store';

import {
  functionsMiddleware,
  apiMiddleware,
  promiseMiddleware,
  fetchMiddleware,
} from './middlewares';

chai.use(spies);

export const mockApi = {
  keys: ['get', 'put', 'search', 'auth', 'unauth'],
  reset(handler = payload => Promise.resolve(payload)) {
    Object.assign(
      this,
      this.keys.reduce((a, k) => ({ ...a, [k]: chai.spy(handler) }), {}),
    );
  },
};

export default configureMockStore([
  functionsMiddleware(),
  apiMiddleware(mockApi),
  promiseMiddleware(mockApi),
  fetchMiddleware(mockApi),
]);
