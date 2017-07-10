import { createSelector } from 'reselect';
import { batchActions } from 'redux-batched-actions';
import Immutable, { List, Map } from 'immutable';
import { pick } from 'lodash';

import createReducer from '~/store/createReducer';
import { escapeStringRegexp } from '~/helpers';
import { getIndexStars } from './user';

export const SCOPE = 'law_index';

// ******************************************************************
// ACTIONS
export const FETCH = 'law_index/FETCH';
export const SELECT_INITIAL = 'law_index/SELECT_INITIAL';
export const SELECT_PAGE = 'law_index/SELECT_PAGE';
export const SELECT_COLLECTION = 'law_index/SELECT_COLLECTION';
export const FILTER = 'law_index/FILTER';
export const SHOW_TOGGLES = 'law_index/SHOW_TOGGLES';

// ******************************************************************
// REDUCERS
export default createReducer(
  Map({
    collections: List(),
    collection: undefined,
    error: undefined,
    filters: Map(),
    initials: List(),
    initial: '',
    laws: List(),
    page: 1,
    pageSize: 25,
    total: -1,
    showToggles: false,
  }),
  {
    [FETCH]: (state, { payload: { initials, index, collections, total } }) =>
      state.merge({
        initials: List(initials || []),
        laws: Immutable.fromJS(index || []),
        collections: Immutable.fromJS(collections || []),
        total,
      }),
    [SHOW_TOGGLES]: (state, { payload }) => state.set('showToggles', payload),
    [SELECT_COLLECTION]: (state, { payload }) =>
      state.set('collection', payload),
    [SELECT_INITIAL]: (state, { payload }) => state.set('initial', payload),
    [SELECT_PAGE]: (state, { payload }) => state.set('page', payload),
    [FILTER]: (state, { payload }) => state.mergeIn(['filters'], Map(payload)),
  },
);

// ******************************************************************
// ACTION CREATORS
export const fetchLawIndex = params => ({
  type: FETCH,
  api: { method: 'get', name: 'laws', cachable: true, ...params },
});

export const showToggles = (state = true) => ({
  type: SHOW_TOGGLES,
  payload: !!state,
});

export const select = options => dispatch => {
  const { collection, initial = '', page = 1 } = options;
  dispatch(
    batchActions([
      { type: SELECT_COLLECTION, payload: collection },
      { type: SELECT_INITIAL, payload: initial.toLowerCase() },
      { type: SELECT_PAGE, payload: parseInt(page, 10) },
    ]),
  );
};

export const filterLawIndex = (filters = {}) => dispatch => {
  const payload = pick(filters, ['starred', 'title', 'groupkey']);
  dispatch(
    batchActions([
      { type: FILTER, payload },
      { type: SELECT_PAGE, payload: 1 },
    ]),
  );
};

// ******************************************************************
// SELECTORS
export const getCollections = state => state.getIn([SCOPE, 'collections']);

export const getCollectionTitle = state => state.getIn([SCOPE, 'collection']);

export const getFilters = state => state.getIn([SCOPE, 'filters']);

export const getInitial = state => state.getIn([SCOPE, 'initial']);

export const getInitials = state => state.getIn([SCOPE, 'initials']);

export const getLawIndex = state => state.getIn([SCOPE, 'laws']);

export const getPage = state => state.getIn([SCOPE, 'page']);

export const getPageSize = state => state.getIn([SCOPE, 'pageSize']);

export const getTotal = state => state.getIn([SCOPE, 'total']);

export const getToggles = state => state.getIn([SCOPE, 'showToggles']);

export const isLoaded = createSelector(
  [getTotal, getLawIndex],
  (total, laws) => total > -1 && total === laws.size,
);

export const getCollectionTitles = createSelector(
  [getCollections],
  collections => collections.map(coll => coll.get('title')),
);

export const getCollection = createSelector(
  [getCollections, getCollectionTitle],
  (collections, title) => {
    if (!title) {
      return Map();
    }
    const result = collections.find(coll => coll.get('title') === title);
    return result || Map();
  },
);

export const getLawsByCollection = createSelector(
  [getLawIndex, getCollection],
  (laws, collection) => {
    if (!collection.has('laws')) {
      return laws;
    }
    const keys = collection
      .get('laws')
      .map(groupkey => groupkey.toLowerCase());
    return laws.filter(l => keys.includes(l.get('groupkey').toLowerCase()));
  },
);

export const getLawsByInitial = createSelector(
  [getLawsByCollection, getInitial],
  (laws, char) => {
    if (!char) {
      return laws;
    }
    const pattern = new RegExp(`^${char}`, 'i');
    return laws.filter(law => pattern.test(law.get('groupkey')));
  },
);

// Filter laws of the specified initial by starred if requested.
// Wrapped in its own selector to utilize memorization.
export const getStarFilteredLawsByInitial = createSelector(
  [getLawsByInitial, getFilters, getIndexStars],
  (laws, filters, stars) => {
    if (filters.get('starred')) {
      return laws.filter(law => stars.has(law.get('groupkey')));
    }

    return laws;
  },
);

// Filter laws of the specified initial probably already filtered by starred
// further more by groupkey if requested.
// Wrapped in its own selector to utilize memorization.
export const getStarAndKeyFilteredLawsByInitial = createSelector(
  [getStarFilteredLawsByInitial, getFilters],
  (laws, filters) => {
    const groupkey = filters.get('groupkey');
    if (groupkey) {
      const pattern = new RegExp(escapeStringRegexp(groupkey), 'i');
      return laws.filter(law => pattern.test(law.get('groupkey')));
    }

    return laws;
  },
);

// Filter laws of the specified initial probably already filtered by starred
// and groupkey further more by title if requested.
// Wrapped in its own selector to utilize memorization.
export const getFilteredLaws = createSelector(
  [getStarAndKeyFilteredLawsByInitial, getFilters],
  (laws, filters) => {
    const title = filters.get('title');
    if (title) {
      const pattern = new RegExp(escapeStringRegexp(title), 'i');
      return laws.filter(law => pattern.test(law.get('title')));
    }

    return laws;
  },
);

export const getFilteredLawsCount = state => getFilteredLaws(state).size;

export const getFilteredLawsByPage = createSelector(
  [getFilteredLaws, getPage, getPageSize],
  (laws, page, size) => laws.slice(size * (page - 1), size * page),
);
