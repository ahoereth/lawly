import chai, { expect } from 'chai';
import spies from 'chai-spies';
import configureMockStore from 'redux-mock-store';
chai.use(spies);

import { Map, OrderedMap } from 'immutable';

import functionsMiddleware from '../middlewares/functionsMiddleware';
import reducer, {
  SEARCH,
  SELECT_PAGE,
  selectSearchPage,
  search,
  getQuery,
  getPage,
  getPageSize,
  getLawsByQuery,
  // getLawsByQueryAndPage,
} from './search';


const mockStore = configureMockStore([ functionsMiddleware() ]);


describe('search', () => {
  const initialState = Map({
    page: 1,
    pageSize: 20,
    query: '',
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

    it('should handle SELECT_PAGE', () => {
      const state = reducer({}, { type: SELECT_PAGE, payload: 12 });
      expect(state.get('page')).to.equal(12);
    });
  });


  describe('actions', () => {
    it('should create an action to select a page', () => {
      const expectedAction = { type: SELECT_PAGE, payload: 12 };
      const store = mockStore(initialState);
      store.dispatch(selectSearchPage(12));
      expect(store.getActions()).to.contain(expectedAction);
    });

    it('should create an action search', () => {
      const query = 'myquery';
      const expectedAction = { type: SEARCH, payload: query };
      const store = mockStore(initialState);
      store.dispatch(search(query));
      expect(store.getActions()).to.contain(expectedAction);
    });
  });


  describe('selectors', () => {
    it('should provide a selector to get the search query', () => {
      const query = 'myquery';
      const state = Map({ search: Map({ query }) });
      expect(getQuery(state)).to.equal(query);
    });

    it('should provide a selector to get the current page', () => {
      const page = 12;
      const state = Map({ search: Map({ page }) });
      expect(getPage(state)).to.equal(page);
    });

    it('should provide a selector to get the page size', () => {
      const pageSize = 12;
      const state = Map({ search: Map({ pageSize }) });
      expect(getPageSize(state)).to.equal(pageSize);
    });

    it('should provide a selector to get the laws by query', () => {
      const state = Map({
        law_index: Map({
          laws: OrderedMap({
            na: Map({ groupkey: 'na', title: 'nope' }),
            no: Map({ groupkey: 'no', title: 'yes' }),
            yo: Map({ groupkey: 'yo', title: 'neither' }),
          }),
        }),
        search: Map({
          query: 'y'
        }),
      });
      const result = OrderedMap({
        no: Map({ groupkey: 'no', title: 'yes' }),
        yo: Map({ groupkey: 'yo', title: 'neither' }),
      });
      expect(getLawsByQuery(state)).to.equal(result);
    });
  });
});
