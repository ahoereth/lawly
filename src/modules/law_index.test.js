import chai, { expect } from 'chai';
import chaiImmutable from 'chai-immutable';
import { List, Map, fromJS } from 'immutable';

import mockStore, { mockApi } from 'store/mockStore';
import reducer, {
  SCOPE,

  FETCH,
  SELECT_INITIAL,
  SELECT_PAGE,
  SELECT_COLLECTION,
  FILTER,

  fetchLawIndex,
  selectLawIndexPage,
  selectLawIndexInitial,
  selectCollection,
  filterLawIndex,

  getLawIndex,
  getPage,
  getPageSize,
  getInitials,
  getInitial,
  // getCollections,
  // getCollectionTitle,
  // getFilters,
  // getCollection,
  // getCollectionTitles,
  // getLawsByCollection,
  getLawsByInitial,
  // getStarFilteredLawsByInitial,
  // getStarAndKeyFilteredLawsByInitial,
  // getFilteredLaws,
  // getFilteredLawsCount,
  // getFilteredLawsByPage,
} from './law_index';


chai.use(chaiImmutable);


describe('law_index', () => {
  const localState = Map({
    laws: List(),
    collections: List(),
    collection: undefined,
    initials: List(),
    initial: '',
    page: 1,
    pageSize: 20,
    error: undefined,
    filters: Map(),
  });

  const initialState = Map({
    [SCOPE]: localState,
  });

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).to.equal(localState);
    });

    it('should handle FETCH', () => {
      const initials = ['a', 'b'];
      const index = [{ groupkey: 'a' }, { groupkey: 'b' }];
      const collections = [{ title: 'Deutsche Gesetze', laws: ['a', 'b'] }];
      const action = { type: FETCH, payload: { index, initials, collections } };
      const state = reducer(localState, action);

      expect(state.get('laws')).to.equal(fromJS(index));
      expect(state.get('initials')).to.equal(List(initials));
      expect(state.get('collections')).to.equal(fromJS(collections));
    });

    it('should handle SELECT_PAGE', () => {
      const action = { type: SELECT_PAGE, payload: 12 };
      const state = reducer(localState, action);
      expect(state.get('page')).to.equal(12);
    });

    it('should handle SELECT_INITIAL', () => {
      const action = { type: SELECT_INITIAL, payload: 'z' };
      const state = reducer(localState, action);
      expect(state.get('initial')).to.equal('z');
    });

    it('should handle SELECT_COLLECTION', () => {
      const action = { type: SELECT_COLLECTION, payload: 'foo' };
      const state = reducer(localState, action);
      expect(state.get('collection')).to.equal('foo');
    });

    it('should handle FILTER', () => {
      const filter = { starred: true, title: 'abc', groupkey: 'def' };
      const action = { type: FILTER, payload: filter };
      const state = reducer(localState, action);
      expect(state.get('filters')).to.equal(Map(filter));
    });
  });


  describe('actions', () => {
    it('fetchLawIndex() should dispatch FETCH', (done) => {
      const payload = { initials: [], index: [] };
      const action = { type: FETCH, payload };
      mockApi.reset(() => Promise.resolve(payload));
      const store = mockStore(initialState);
      store.dispatch(fetchLawIndex()).then((dispatchedAction) => {
        expect(mockApi.get).to.be.called.once;
        expect(dispatchedAction).to.deep.equal(action);
      }).then(done, done);
    });

    it('selectLawIndexPage() should dispatch SELECT_PAGE', () => {
      const action = { type: SELECT_PAGE, payload: 7 };
      const store = mockStore(initialState);
      store.dispatch(selectLawIndexPage(7));
      expect(store.getActions()).to.deep.contain(action);
    });

    it('selectLawIndexInitial() should dispatch SELECT_INITIAL', () => {
      const action = { type: SELECT_INITIAL, payload: 'z' };
      const store = mockStore(initialState);
      store.dispatch(selectLawIndexInitial('z'));
      expect(store.getActions()).to.deep.contain(action);
    });

    it('selectLawIndexInitial() should dispatch SELECT_PAGE', () => {
      const action = { type: SELECT_PAGE, payload: 1 };
      const store = mockStore(initialState);
      store.dispatch(selectLawIndexInitial('z'));
      expect(store.getActions()).to.deep.contain(action);
    });

    it('selectCollection() should dispatch SELECT_COLLECTION', () => {
      const action = { type: SELECT_COLLECTION, payload: 'a' };
      const store = mockStore(initialState);
      store.dispatch(selectCollection('a'));
      expect(store.getActions()).to.deep.contain(action);
    });

    it('filterLawIndex should dispatch FILTER', () => {
      const action = { type: FILTER, payload: {} };
      const store = mockStore(initialState);
      store.dispatch(filterLawIndex(action.payload));
      expect(store.getActions()).to.deep.contain(action);
    });

    it('filterLawIndex should pick legal filter keys', () => {
      const payload = { starred: true, title: 'a', groupkey: 'b' };
      const action = { type: FILTER, payload };
      const store = mockStore(initialState);
      store.dispatch(filterLawIndex(Object.assign({}, payload, { foo: 'c' })));
      expect(store.getActions()).to.deep.contain(action);
    });
  });


  describe('selectors', () => {
    it('should provide getLawIndex()', () => {
      const laws = List([Map({ groupkey: 'a' })]);
      const state = initialState.setIn([SCOPE, 'laws'], laws);
      expect(getLawIndex(state)).to.equal(laws);
    });

    it('should provide getPage()', () => {
      const state = initialState.setIn([SCOPE, 'page'], 7);
      expect(getPage(state)).to.equal(7);
    });

    it('should provide getPageSize()', () => {
      const state = initialState.setIn([SCOPE, 'pageSize'], 12);
      expect(getPageSize(state)).to.equal(12);
    });

    it('should provide getInitial()', () => {
      const state = initialState.setIn([SCOPE, 'initial'], 'z');
      expect(getInitial(state)).to.equal('z');
    });

    it('should provide getInitials()', () => {
      const initials = List(['a', 'b', 'c']);
      const state = initialState.setIn([SCOPE, 'initials'], initials);
      expect(getInitials(state)).to.equal(initials);
    });

    // getCollections,
    // getCollectionTitle,
    // getFilters,
    // getCollection,
    // getCollectionTitles,
    // getLawsByCollection,

    it('should provide getLawsByInitial()', () => {
      const laws = List([Map({ groupkey: 'a' }), Map({ groupkey: 'z' })]);
      const state = initialState.mergeIn([SCOPE], Map({ initial: 'z', laws }));
      const expectedSlice = laws.filter(law => law.get('groupkey') === 'z');
      expect(getLawsByInitial(state)).to.equal(expectedSlice);
    });

    // getStarFilteredLawsByInitial,
    // getStarAndKeyFilteredLawsByInitial,
    // getFilteredLaws,
    // getFilteredLawsCount,
    // getFilteredLawsByPage,
  });
});
