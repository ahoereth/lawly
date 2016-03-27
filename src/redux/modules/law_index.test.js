import chai, { expect } from 'chai';
import spies from 'chai-spies';
import configureMockStore from 'redux-mock-store';
chai.use(spies);

import { arr2obj } from 'helpers/utils';
import promiseMiddleware from '../middlewares/promiseMiddleware';
import functionsMiddleware from '../middlewares/functionsMiddleware';
import reducer, {
  FETCH,
  SELECT_INITIAL,
  SELECT_PAGE,
  fetchLawIndex,
  selectLawIndexInitial,
  selectLawIndexPage,
  getLawIndexRaw,
  getPageSize,
  getPage,
  getInitial,
  getLawIndex,
  getLawsByInitial,
  getLawsByInitialAndPage,
} from './law_index';


const mockApi = {};
const mockStore = configureMockStore([
  functionsMiddleware(),
  promiseMiddleware(mockApi)
]);


describe('law_index', () => {
  const initialState = { law_index: {
    laws: {},
    initials: [],
    initial: 'a',
    page: 1,
    pageSize: 20,
    error: undefined,
  }};

  describe('reducer', () => {
    it('should return the initial state', () => {
      const state = reducer(undefined, {});
      expect(state).to.have.all.keys(Object.keys(initialState.law_index));
      expect(state).to.deep.equal(initialState.law_index);
    });

    it('should handle fetching the law index', () => {
      const initials = [ 'a', 'b' ];
      const index = [ { groupkey: 'a' }, { groupkey: 'b' } ];
      const action = { type: FETCH, payload: { index, initials } };
      const state = reducer(initialState.law_index, action);
      expect(state.laws).to.deep.equal(arr2obj(index, 'groupkey'));
      expect(state.initials).to.deep.equal(initials);
    });

    it('should handle selecting a page', () => {
      const page = 12;
      const action = { type: SELECT_PAGE, payload: page };
      const state = reducer(initialState.law_index, action);
      expect(state.page).to.equal(page);
    });

    it('should handle selecting an initial', () => {
      const initial = 'z';
      const action = { type: SELECT_INITIAL, payload: initial };
      const state = reducer(initialState.law_index, action);
      expect(state.initial).to.equal(initial);
    });
  });


  describe('actions', () => {
    it('should create an action to fetch the law index', (done) => {
      const payload = { initials: [], index: [] };
      const action = { type: FETCH, payload };
      mockApi.get = chai.spy(() => Promise.resolve(payload));

      mockStore(initialState).dispatch(fetchLawIndex())
        .then((dispatchedAction) => {
          expect(mockApi.get).to.be.called.once;
          expect(dispatchedAction).to.deep.equal(action);
        })
        .then(done, done);
    });

    it('should create an action to select a page', () => {
      const page = 7;
      const action = { type: SELECT_PAGE, payload: page };
      const store = mockStore(initialState);
      store.dispatch(selectLawIndexPage(page));
      expect(store.getActions()).to.deep.contain(action);
    });

    it('should create an action to select an initial', () => {
      const initial = 'z';
      const action = { type: SELECT_INITIAL, payload: initial };
      const store = mockStore(initialState);
      store.dispatch(selectLawIndexInitial(initial));
      expect(store.getActions()).to.deep.contain(action);
    });

    it('should dispatch a page change when selecting an initial', () => {
      const action = { type: SELECT_PAGE, payload: 1 };
      const store = mockStore(initialState);
      store.dispatch(selectLawIndexInitial('z'));
      expect(store.getActions()).to.deep.contain(action);
    });
  });


  describe('selectors', () => {
    it('should provide a selector to get the index object', () => {
      const laws = { a: { groupkey: 'a' } };
      const store = mockStore({ law_index: { laws } });
      expect(getLawIndexRaw(store.getState())).to.deep.equal(laws);
    });

    it('should provide a selector to get the page size', () => {
      const pageSize = 12;
      const store = mockStore({ law_index: { pageSize } });
      expect(getPageSize(store.getState())).to.deep.equal(pageSize);
    });

    it('should provide a selector to get the current page', () => {
      const page = 7;
      const store = mockStore({ law_index: { page } });
      expect(getPage(store.getState())).to.deep.equal(page);
    });

    it('should provide a selector to get the initial', () => {
      const initial = 'z';
      const store = mockStore({ law_index: { initial } });
      expect(getInitial(store.getState())).to.deep.equal(initial);
    });

    it('should provide a selector to get the law index as array', () => {
      const laws = { a: {groupkey: 'a'} };
      const store = mockStore({ law_index: { laws } });
      expect(getLawIndex(store.getState())).to.deep.equal([ {groupkey: 'a'} ]);
    });

    it('should provide a selector to get by initial', () => {
      const laws = { a: {groupkey: 'a'}, z: {groupkey: 'z'} };
      const store = mockStore({ law_index: { laws, initial: 'z' } });
      const state = store.getState();
      expect(getLawsByInitial(state)).to.deep.equal([ {groupkey: 'z'} ]);
    });

    it('should provide a selector to get by initial and page', () => {
      const laws = { aa: {groupkey: 'a'}, ab: {groupkey: 'ab'} };
      const state = { law_index: { laws, initial: 'a', page: 2, pageSize: 1 } };
      const selected = { total: 2, laws: [ {groupkey: 'ab'} ] };
      expect(getLawsByInitialAndPage(state)).to.deep.equal(selected);
    });
  });
});
