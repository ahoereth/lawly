import chai, { expect } from 'chai';
import spies from 'chai-spies';
import configureMockStore from 'redux-mock-store';
chai.use(spies);

import { Map, List } from 'immutable';

import functionsMiddleware from '../middlewares/functionsMiddleware';
import reducer, {
  SEARCH,
  SEARCHED,
  SELECT_PAGE,

  selectSearchPage,
  search,

  getQuery,
  getPage,
  getPageSize,
  // getResults,
  // getResultsByPage,
} from 'redux/modules/search';


const mockStore = configureMockStore([ functionsMiddleware() ]);


describe('search', () => {
  const initialState = Map({
    page: 1,
    pageSize: 20,
    query: '',
    results: List(),
  });

  describe('reducer', () => {
    it('should return the initial state', () => {
      const state = reducer(undefined, {});
      expect(state).to.equal(initialState);
    });

    it('should handle SEARCH', () => {
      const state = reducer({}, { type: SEARCH, payload: 'myquery' });
      expect(state.get('query')).to.equal('myquery');
    });

    it('should handle SEARCHED', () => {
      const payload = [ 'a', 'b' ];
      const state = reducer({}, { type: SEARCHED, payload });
      expect(state.get('results')).to.equal(List(payload));
    });

    it('should handle SELECT_PAGE', () => {
      const state = reducer({}, { type: SELECT_PAGE, payload: 12 });
      expect(state.get('page')).to.equal(12);
    });
  });


  describe('actions', () => {
    it('selectSearchPage() should dispatch SELECT_PAGE', () => {
      const expectedAction = { type: SELECT_PAGE, payload: 12 };
      const store = mockStore(initialState);
      store.dispatch(selectSearchPage(12));
      expect(store.getActions()).to.contain(expectedAction);
    });

    it('search() should dispatch SEARCH', () => {
      const query = 'myquery';
      const expectedAction = { type: SEARCH, payload: query };
      const store = mockStore(initialState);
      store.dispatch(search(query));
      expect(store.getActions()).to.contain(expectedAction);
    });

    it('search() should dispatch SEARCHED', () => {
      // TODO
    });
  });


  describe('selectors', () => {
    it('should provide getQuery', () => {
      const query = 'myquery';
      const state = Map({ search: Map({ query }) });
      expect(getQuery(state)).to.equal(query);
    });

    it('should provide getPage', () => {
      const page = 12;
      const state = Map({ search: Map({ page }) });
      expect(getPage(state)).to.equal(page);
    });

    it('should provide getPageSize', () => {
      const pageSize = 12;
      const state = Map({ search: Map({ pageSize }) });
      expect(getPageSize(state)).to.equal(pageSize);
    });

    // it('should provide getResults and getResultsByPage', () => {
    //   const state = Map({
    //     law_index: Map({
    //       laws: List([
    //         Map({ groupkey: 'na', title: 'nope' }),
    //         Map({ groupkey: 'no', title: 'yes' }),
    //         Map({ groupkey: 'yo', title: 'neither' }),
    //       ]),
    //     }),
    //     search: Map({
    //       query: 'y'
    //     }),
    //   });
    //   const result = List([
    //     Map({ groupkey: 'no', title: 'yes' }),
    //     Map({ groupkey: 'yo', title: 'neither' }),
    //   ]);
    //   expect(getResults(state)).to.equal(result);
    // });
  });
});
