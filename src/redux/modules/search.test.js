import chai, { expect } from 'chai';
import spies from 'chai-spies';
import configureMockStore from 'redux-mock-store';
chai.use(spies);

import { Map, List } from 'immutable';

import functionsMiddleware from '../middlewares/functionsMiddleware';
import promiseMiddleware from '../middlewares/promiseMiddleware';
import reducer, {
  SCOPE,

  SEARCH,
  SEARCHED,
  SELECT_PAGE,

  selectPage,
  search,

  getQuery,
  getPage,
  getPageSize,
  getResults,
  getTotal,
  getResultsByPage,
} from './search';


const mockApi = {};
const mockStore = configureMockStore([
  functionsMiddleware(),
  promiseMiddleware(mockApi)
]);


describe('search', () => {
  const localState = Map({
    page: 1,
    pageSize: 20,
    query: '',
    results: List(),
    total: 0,
  });

  const initialState = Map({
    [SCOPE]: localState,
  });

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).to.equal(localState);
    });

    it('should handle SEARCH', () => {
      const state = reducer({}, { type: SEARCH, payload: 'myquery' });
      expect(state.get('query')).to.equal('myquery');
    });

    it('should handle SEARCHED', () => {
      const payload = { total: 2, results: [ 'a', 'b' ] };
      const state = reducer({}, { type: SEARCHED, payload });
      expect(state.get('results')).to.equal(List(payload.results));
      expect(state.get('total')).to.equal(payload.total);
    });

    it('should handle SELECT_PAGE', () => {
      const state = reducer({}, { type: SELECT_PAGE, payload: 12 });
      expect(state.get('page')).to.equal(12);
    });
  });


  describe('actions', () => {
    it('selectPage() should dispatch SELECT_PAGE', () => {
      const expectedAction = { type: SELECT_PAGE, payload: 12 };
      const store = mockStore(localState);
      store.dispatch(selectPage(12));
      expect(store.getActions()).to.contain(expectedAction);
    });

    it('search() should dispatch SEARCH', () => {
      const expectedAction = { type: SEARCH, payload: 'foo' };
      mockApi.search = () => Promise.resolve();
      const store = mockStore(localState);
      store.dispatch(search('foo'));
      expect(store.getActions()).to.contain(expectedAction);
    });

    it('search() should dispatch SEARCHED', (done) => {
      const action = { type: SEARCHED, payload: { total: 2, results: [] } };
      mockApi.search = chai.spy(() => Promise.resolve(action.payload));
      const store = mockStore(localState);
      store.dispatch(search()).then((dispatchedAction) => {
        expect(mockApi.search).to.be.called.once;
        expect(dispatchedAction).to.deep.equal(action);
      }).then(done, done);
    });
  });


  describe('selectors', () => {
    it('should provide getQuery()', () => {
      const state = initialState.setIn([SCOPE, 'query'], 'foo');
      expect(getQuery(state)).to.equal('foo');
    });

    it('should provide getPage()', () => {
      const state = initialState.setIn([SCOPE, 'page'], 7);
      expect(getPage(state)).to.equal(7);
    });

    it('should provide getPageSize()', () => {
      const state = initialState.setIn([SCOPE, 'pageSize'], 12);
      expect(getPageSize(state)).to.equal(12);
    });

    it('should provide getResults()', () => {
      const results = List([ Map(), Map() ]);
      const state = initialState.setIn([SCOPE, 'results'], results);
      expect(getResults(state)).to.equal(results);
    });

    it('should provide getTotal()', () => {
      const state = initialState.setIn([SCOPE, 'total'], 7);
      expect(getTotal(state)).to.equal(7);
    });

    it('should provide getResultsByPage()', () => {
      const results = List([
        Map({ groupkey: 'no', title: 'nope' }),
        Map({ groupkey: 'na', title: 'neither' }),
        Map({ groupkey: 'yop', title: 'exactly' }),
        Map({ groupkey: 'yes', title: 'this as well' }),
      ]);
      const state = initialState.mergeIn([SCOPE], Map({
        results: results, total: 4, page: 2, pageSize: 2,
      }));
      expect(getResultsByPage(state)).to.equal(results.slice(-2));
    });
  });
});
