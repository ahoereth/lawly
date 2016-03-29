import chai, { expect } from 'chai';
import spies from 'chai-spies';
import chaiImmutable from 'chai-immutable';
import configureMockStore from 'redux-mock-store';
chai.use(spies);
chai.use(chaiImmutable);

import { List, OrderedMap, Map } from 'immutable';

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
  getPageSize,
  getPage,
  getInitial,
  getInitials,
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
  const initialState = Map({
    law_index: Map({
      laws: OrderedMap(),
      initials: List(),
      initial: 'a',
      page: 1,
      pageSize: 20,
      error: undefined,
    }),
  });

  describe('reducer', () => {
    it('should return the initial state', () => {
      const state = reducer(undefined, {});
      expect(state).to.equal(initialState.get('law_index'));
    });

    it('should handle fetching the law index', () => {
      const initials = [ 'a', 'b' ];
      const index = [ { groupkey: 'a' }, { groupkey: 'b' } ];
      const action = { type: FETCH, payload: { index, initials } };
      const state = reducer(initialState.law_index, action);

      const expectedIndex = OrderedMap(arr2obj(index, 'groupkey', Map));
      expect(state.get('laws')).to.equal(expectedIndex);
      expect(state.get('initials')).to.equal(List(initials));
    });

    it('should handle selecting a page', () => {
      const page = 12;
      const action = { type: SELECT_PAGE, payload: page };
      const state = reducer(initialState.law_index, action);
      expect(state.get('page')).to.equal(page);
    });

    it('should handle selecting an initial', () => {
      const initial = 'z';
      const action = { type: SELECT_INITIAL, payload: initial };
      const state = reducer(initialState.law_index, action);
      expect(state.get('initial')).to.equal(initial);
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
      const laws = OrderedMap({ a: Map({ groupkey: 'a' }) });
      const state = Map({ law_index: Map({ laws }) });
      expect(getLawIndex(state)).to.equal(laws);
    });

    it('should provide a selector to get the page size', () => {
      const pageSize = 12;
      const state = Map({ law_index: Map({ pageSize }) });
      expect(getPageSize(state)).to.equal(pageSize);
    });

    it('should provide a selector to get the current page', () => {
      const page = 7;
      const state = Map({ law_index: Map({ page }) });
      expect(getPage(state)).to.equal(page);
    });

    it('should provide a selector to get the initial', () => {
      const initial = 'z';
      const state = Map({ law_index: Map({ initial }) });
      expect(getInitial(state)).to.equal(initial);
    });

    it('should provide a selector to get the list of initials', () => {
      const initials = List(['a', 'b', 'c']);
      const state = Map({ law_index: Map({ initials }) });
      expect(getInitials(state)).to.equal(initials);
    });

    it('should provide a selector to get by initial', () => {
      const laws = OrderedMap({
        a: Map({ groupkey: 'a' }),
        z: Map({ groupkey: 'z' }),
      });
      const state = Map({ law_index: Map({ laws, initial: 'z' }) });
      const expectedSlice = OrderedMap({z: Map({groupkey: 'z'})});
      expect(getLawsByInitial(state)).to.equal(expectedSlice);
    });

    it('should provide a selector to get by initial and page', () => {
      const srcLaws = OrderedMap({
        aa: Map({ groupkey: 'a' }),
        ab: Map({ groupkey: 'ab' }),
        z: Map({ groupkey: 'z' }),
      });
      const state = Map({ law_index: Map({
        laws: srcLaws, initial: 'a', page: 2, pageSize: 1
      })});
      const { total, laws } = getLawsByInitialAndPage(state);
      expect(laws).to.equal(OrderedMap({ab: Map({groupkey: 'ab'})}));
      expect(total).to.equal(2);
    });
  });
});
