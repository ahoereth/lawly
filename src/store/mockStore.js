import chai from 'chai';
import spies from 'chai-spies';
import configureMockStore from 'redux-mock-store';
chai.use(spies);

import {
  functionsMiddleware,
  apiMiddleware,
  promiseMiddleware,
  fetchMiddleware,
} from './middlewares';


export const mockApi = {
  keys: ['get', 'put', 'search', 'auth', 'unauth'],
  reset: function(handler) {
    handler = handler || (payload => Promise.resolve(payload));
    handler = chai.spy(handler);
    const mocks = this.keys.reduce((a, k) => ({ ...a, [k]: handler }), {});
    Object.assign(this, mocks);
  },
};

export default configureMockStore([
  functionsMiddleware(),
  apiMiddleware(mockApi),
  promiseMiddleware(mockApi),
  fetchMiddleware(mockApi),
]);
