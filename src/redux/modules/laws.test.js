import chai, { expect } from 'chai';
import spies from 'chai-spies';
import configureMockStore from 'redux-mock-store';
chai.use(spies);

import { Map, List } from 'immutable';

import promiseMiddleware from '../middlewares/promiseMiddleware';
import reducer, {
  FETCH_SINGLE,
  fetchLaw,
  getLaws,
} from './laws';


const mockApi = {};
const mockStore = configureMockStore([ promiseMiddleware(mockApi) ]);


describe('laws', () => {
  const initialState = Map({ laws: Map(), error: undefined });

  describe('reducer', () => {
    it('should return the initial state', () => {
      const state = reducer(undefined, {});
      expect(state).to.equal(initialState);
    });

    it('should handle fetching a law', () => {
      const a = { groupkey: 'a', n: 1 }, b = { groupkey: 'a', n: 2 };
      const state = reducer({}, { type: FETCH_SINGLE, payload: [ a, b ] });
      expect(state.get('laws')).to.equal(Map({ a: List([ Map(a), Map(b) ]) }));
    });
  });


  describe('actions', () => {
    it('should create an action to fetch a single law', (done) => {
      const groupkey = 'BGB';
      const expectedAction = { type: FETCH_SINGLE, payload: { groupkey } };
      mockApi.get = chai.spy(({groupkey}) => Promise.resolve({groupkey}));

      mockStore(initialState).dispatch(fetchLaw(groupkey))
        .then((dispatchedAction) => {
          expect(mockApi.get).to.be.called.once;
          expect(dispatchedAction).to.deep.equal(expectedAction);
        })
        .then(done, done);
    });
  });


  describe('selectors', () => {
    it('should provide a selector to get all laws in an object', () => {
      const laws = Map({ BGB: Map({ groupkey: 'BGB' }) });
      const state = Map({ laws: Map({ laws }) });
      expect(getLaws(state)).to.equal(laws);
    });
  });
});
