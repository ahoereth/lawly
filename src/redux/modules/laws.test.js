import chai, { expect } from 'chai';
import spies from 'chai-spies';
import configureMockStore from 'redux-mock-store';
chai.use(spies);

import promiseMiddleware from '../middlewares/promiseMiddleware';
import reducer, {
  FETCH_SINGLE,
  fetchLaw,
  getLaws,
} from './laws';


const mockApi = {};
const mockStore = configureMockStore([ promiseMiddleware(mockApi) ]);


describe('laws', () => {
  const initialState = { laws: {}, error: undefined };

  describe('reducer', () => {
    it('should return the initial state', () => {
      const state = reducer(undefined, {});
      expect(state).to.have.all.keys(Object.keys(initialState));
      expect(state).to.deep.equal(initialState);
    });

    it('should handle fetching a law', () => {
      const groupkey = 'BGB';
      const norms = [ { groupkey, n: 1 }, { groupkey, n: 2 } ];
      const state = reducer({}, { type: FETCH_SINGLE, payload: norms });
      expect(state.laws[groupkey]).to.deep.equal(norms);
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
      const laws = { BGB: { groupkey: 'BGB' } };
      const store = mockStore({ laws: { laws } });
      expect(getLaws(store.getState())).to.deep.equal(laws);
    });
  });
});
