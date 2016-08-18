import { expect } from 'chai';
import { List, Map, fromJS } from 'immutable';

import mockStore, { mockApi } from '~/store/mockStore';
import reducer, {
  SCOPE,

  LOGIN,
  LOGOUT,
  STAR,

  login,
  logout,
  star,
  getUser,
  getUserLaws,
  getStarredUserLaws,
  getIndexStars,
  getSelectionAnnotations,
} from './user';
import { SCOPE as lawsSCOPE } from './laws';


describe('user', () => {
  const localState = Map({
    loggedin: false,
    email: undefined,
    laws: List(),
    error: false,
  });

  const initialState = Map({
    [SCOPE]: localState,
  });

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).to.equal(localState);
    });

    it('should handle LOGIN', () => {
      const payload = {
        email: 'mail',
        laws: { a: { 0: { starred: true } } },
      };
      const state = reducer(undefined, { type: LOGIN, payload });
      expect(state.get('email')).to.equal('mail');
      expect(state.get('laws')).to.equal(fromJS(payload.laws));
    });

    it('should handle LOGOUT', () => {
      const state = reducer(
        { loggedin: true, email: 'mail', laws: Map({ a: 'a' }) },
        { type: LOGOUT, payload: null }
      );
      expect(state.get('loggedin')).to.be.false;
      expect(state.get('email')).to.be.undefined;
      expect(state.get('laws')).to.equal(Map());
    });

    it('should handle STAR', () => {
      const state = reducer(undefined, {
        type: STAR,
        payload: { groupkey: 'a', enumeration: '0', starred: true },
      });
      expect(state.get('laws').first().get('starred')).to.be.true;
    });
  });


  describe('actions', () => {
    it('login() should dispatch LOGIN', (done) => {
      const expectedAction = {
        type: LOGIN, payload: {
          email: 'mail',
          laws: [{ groupkey: 'a' }],
        },
      };
      const store = mockStore(initialState);
      mockApi.reset(() => Promise.resolve(expectedAction.payload));
      store.dispatch(login('mail', 'pw')).then(action => {
        expect(action).to.deep.equal(expectedAction);
        expect(mockApi.auth).to.be.called.once;
      }).then(done).catch(done);
    });

    it('logout() should dispatch LOGOUT', (done) => {
      const expectedAction = { type: LOGOUT, payload: undefined };
      const store = mockStore(initialState);
      mockApi.reset(() => Promise.resolve());
      store.dispatch(logout('mail')).then(action => {
        expect(action).to.deep.equal(expectedAction);
        expect(mockApi.unauth).to.be.called.once;
      }).then(done).catch(done);
    });

    it('star() should dispatch STAR', () => {
      const law = { groupkey: 'a', enumeration: '0', title: 'foo' };
      const action = { type: STAR, payload: { ...law, starred: true } };
      const store = mockStore(initialState);
      store.dispatch(star(law, true));
      expect(store.getActions()).to.deep.contain(action);
    });

    it('star() should allow immutable maps', () => {
      const law = { groupkey: 'a', enumeration: '0', title: 'foo' };
      const action = { type: STAR, payload: { ...law, starred: false } };
      const store = mockStore(initialState);
      store.dispatch(star(Map(law), false));
      expect(store.getActions()).to.deep.contain(action);
    });
  });


  describe('selectors', () => {
    it('should provide getUser()', () => {
      const state = initialState.setIn([SCOPE, 'email'], 'foo');
      expect(getUser(state).get('email')).to.equal('foo');
    });

    it('should provide getUserLaws()', () => {
      const laws = fromJS({ a: { groupkey: 'a' }, b: { groupkey: 'b' } });
      const state = initialState.setIn([SCOPE, 'laws'], Map(laws));
      expect(getUserLaws(state)).to.equal(laws);
    });

    it('should provide getStarredUserLaws()', () => {
      const state = initialState.setIn([SCOPE, 'laws'], fromJS([
        { groupkey: 'a', enumeration: '0', starred: true },
        { groupkey: 'a', enumeration: '1.3', starred: false },
        { groupkey: 'c', enumeration: '0', starred: false },
      ]));
      const starred = [{ groupkey: 'a', enumeration: '0', starred: true }];
      expect(getStarredUserLaws(state)).to.equal(fromJS(starred));
    });

    it('should provide getIndexStars()', () => {
      const state = initialState.setIn([SCOPE, 'laws'], fromJS([
        { groupkey: 'a', enumeration: '0', starred: true },
        { groupkey: 'a', enumeration: '1.3', starred: false },
        { groupkey: 'a', enumeration: '1.6', starred: true },
        { groupkey: 'b', enumeration: '0', starred: true },
        { groupkey: 'c', enumeration: '0', starred: false },
      ]));
      expect(getIndexStars(state)).to.equal(Map({ a: 1, b: 0 }));
    });

    it('should provide getSelectionAnnotations()', () => {
      const state = initialState.setIn([SCOPE, 'laws'], fromJS([
        { groupkey: 'a', enumeration: '0', starred: true },
        { groupkey: 'a', enumeration: '1.3', starred: false },
        { groupkey: 'a', enumeration: '1.6', starred: true },
        { groupkey: 'b', enumeration: '0', starred: true },
        { groupkey: 'c', enumeration: '0', starred: false },
      ])).setIn([lawsSCOPE, 'selected'], 'a');
      let target = state.getIn([SCOPE, 'laws']).take(3);
      target = Map(target.map(norm => norm.get('enumeration')).zip(target));
      expect(getSelectionAnnotations(state)).to.equal(target);
    });
  });
});
