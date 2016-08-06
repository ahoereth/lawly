import chai, { expect } from 'chai';
import spies from 'chai-spies';
import configureMockStore from 'redux-mock-store';
chai.use(spies);

import { Map, Set, fromJS } from 'immutable';

import { functionsMiddleware, promiseMiddleware } from '../middlewares';
import reducer, {
  LOGIN,
  LOGOUT,
  STAR,
  login,
  logout,
  star,
  getUser,
  getUserLaws,
  getIndexStars,
} from './user';


const mockApi = {};
const mockStore = configureMockStore([
  functionsMiddleware(),
  promiseMiddleware(mockApi),
]);


describe('user', () => {
  const initialState = Map({
    loggedin: false,
    email: undefined,
    laws: Map(),
    error: false,
  });

  describe('reducer', () => {
    it('should return the initial state', () => {
      const state = reducer(undefined, {});
      expect(state).to.equal(initialState);
    });

    it('should handle `LOGIN`', () => {
      const payload = {
        email: 'mail',
        laws: { a: { '0': { starred: true } } },
      };
      const state = reducer(undefined, { type: LOGIN, payload });
      expect(state.get('email')).to.equal('mail');
      expect(state.get('laws')).to.equal(fromJS(payload.laws));
    });

    it('should handle `LOGOUT`', () => {
      const state = reducer(
        { loggedin: true, email: 'mail', laws: Map({a: 'a'}) },
        { type: LOGOUT, payload: null }
      );
      expect(state.get('loggedin')).to.be.false;
      expect(state.get('email')).to.be.undefined;
      expect(state.get('laws')).to.equal(Map());
    });

    it('should handle `STAR`', () => {
      const state = reducer(undefined, {
        type: STAR,
        payload: { groupkey: 'a', enumeration: '0', starred: true }
      });
      expect(state.getIn(['laws', 'a', '0', 'starred'])).to.be.true;
    });
  });


  describe('actions', () => {
    it('should create an action `login`', (done) => {
      const expectedAction = {
        type: LOGIN, payload: {
          email: 'mail',
          laws: [ { groupkey: 'a' } ],
        }
      };
      const store = mockStore(initialState);
      mockApi.auth = chai.spy(() => Promise.resolve(expectedAction.payload));
      store.dispatch(login('mail', 'pw')).then(action => {
        expect(action).to.deep.equal(expectedAction);
        expect(mockApi.auth).to.be.called.once;
      }).then(done).catch(done);
    });

    it('should create an action `logout`', (done) => {
      const expectedAction = { type: LOGOUT, payload: undefined };
      const store = mockStore(initialState);
      mockApi.unauth = chai.spy(() => Promise.resolve());
      store.dispatch(logout('mail')).then(action => {
        expect(action).to.deep.equal(expectedAction);
        expect(mockApi.unauth).to.be.called.once;
      }).then(done).catch(done);
    });

    it('should create an action `star`', (done) => {
      const expectedAction = {
        type: STAR,
        payload: { groupkey: 'a', enumeration: '0', starred: true }
      };
      const store = mockStore(initialState);
      mockApi.put = chai.spy(() => Promise.resolve(expectedAction.payload));
      store.dispatch(star('groupkey', '0')).then(action => {
        expect(action).to.deep.equal(expectedAction);
        expect(mockApi.put).to.be.called.once;
      }).then(done).catch(done);
    });
  });


  describe('selectors', () => {
    it('should provide `getUser` selector', () => {
      const state = Map({ user: Map({ email: 'mail' }) });
      expect(getUser(state)).to.equal(state.get('user'));
    });

    it('should provide `getUserLaws` selector', () => {
      const state = Map({ user: Map({ laws: Map({
        'a': Map({ groupkey: 'a' }),
        'b': Map({ groupkey: 'b' }),
      }) }) });
      expect(getUserLaws(state)).to.equal(state.getIn(['user', 'laws']));
    });

    it('should provide `getIndexStars` selector', () => {
      const state = Map({ user: Map({ laws: Map({
        'a': Map({ '0': Map({ starred: true }) }),
        'b': Map({ '0': Map({ starred: false }) }),
        'c': Map({ '0': Map({ starred: true }) }),
        'd': Map({ '1': Map({ starred: true }) }),
      }) }) });
      expect(getIndexStars(state)).to.equal(Set(['a', 'c']));
    });
  });
});
