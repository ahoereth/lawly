import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import Immutable, { List, Map } from 'immutable';

import { pick } from 'helpers/utils';
import createReducer from '../createReducer';
import { getIndexStars } from './user';


// ******************************************************************
// ACTIONS
export const FETCH = 'law_index/FETCH';
export const SELECT_INITIAL = 'law_index/SELECT_INITIAL';
export const SELECT_PAGE = 'law_index/SELECT_PAGE';
export const FILTER = 'law_index/FILTER';
export const SELECT_COLLECTION = 'law_index/SELECT_COLLECTION';



// ******************************************************************
// REDUCERS
export default createReducer(Map({
  laws: List(),
  collections: List(),
  collection: undefined,
  initials: List(),
  initial: '',
  page: 1,
  pageSize: 20,
  error: undefined,
  filters: Map(),
}), {
  [FETCH]: (state, { payload }) => state.merge({
    initials: List(payload.initials),
    laws: Immutable.fromJS(payload.index),
    collections: Immutable.fromJS(payload.collections),
  }),
  [SELECT_COLLECTION]: (state, { payload }) => state.set('collection', payload),
  [SELECT_INITIAL]: (state, { payload }) => state.set('initial', payload),
  [SELECT_PAGE]: (state, { payload }) => state.set('page', payload),
  [FILTER]: (state, { payload }) => state.mergeIn(['filters'], Map(payload)),
});



// ******************************************************************
// ACTION CREATORS
export const fetchLawIndex = () => ({
  type: FETCH,
  promise: api => api.get({ name: 'laws', cachable: true })
});

export const selectLawIndexPage = (page = 1) => (dispatch, getState) => {
  const initial = getInitial(getState());
  const collection = getCollectionTitle(getState());
  const collectionPath = collection ? collection + '/' : '';
  const initialPath = initial ? initial + '/': '';
  const pagePath = page > 1 ? page : '';
  dispatch({ type: SELECT_PAGE, payload: page || 1 });
  dispatch(push(`/gesetze/${collectionPath}${initialPath}${pagePath}`));
};

export const selectLawIndexInitial = (initial = '') => (dispatch) => {
  dispatch({ type: SELECT_INITIAL, payload: initial.toLowerCase() });
  dispatch(selectLawIndexPage(1));
};

export const selectCollection = collection => dispatch => {
  dispatch({ type: SELECT_COLLECTION, payload: collection });
  dispatch(selectLawIndexInitial(''));
};

export const filterLawIndex = (filters = {}) => (dispatch) => {
  filters = pick(filters, 'starred', 'title', 'groupkey');
  dispatch({ type: FILTER, payload: filters });
  dispatch(selectLawIndexPage(1));
};



// ******************************************************************
// SELECTORS
export const getLawIndex = (state) => state.getIn(['law_index', 'laws']);

export const getPageSize = (state) => state.getIn(['law_index', 'pageSize']);

export const getPage = (state) => state.getIn(['law_index', 'page']);

export const getInitials = (state) => state.getIn(['law_index', 'initials']);

export const getInitial = (state) => state.getIn(['law_index', 'initial']);

export const getCollectionTitle = state => state.getIn(['law_index', 'collection']);

export const getCollections = state => state.getIn(['law_index', 'collections']);

export const getCollectionTitles = createSelector(
  [ getCollections ],
  (collections) => {
    return collections.map(coll => coll.get('title'));
  }
);

export const getCollection = createSelector(
  [ getCollections, getCollectionTitle ],
  (collections, title) => {
    if (!title) { return; }
    const result = collections.find(coll => coll.get('title') === title);
    return result;
  }
);

export const getFilters = (state) => state.getIn(['law_index', 'filters']);

const getLawsByCollection = createSelector(
  [ getLawIndex, getCollection ],
  (laws, collection) => {
    if (!collection) { return laws; }
    const groupkeys = collection.get('laws').map(groupkey => groupkey.toLowerCase());
    return laws.filter(law =>
      groupkeys.indexOf(law.get('groupkey').toLowerCase()) !== -1
    );
  }
);

const getLawsByInitial = createSelector(
  [ getLawsByCollection, getInitial ],
  (laws, char) => {
    if (!char) { return laws; }
    return laws.filter(law => law.get('groupkey')[0].toLowerCase() == char);
  }
);

// Filter laws of the specified initial by starred if requested.
// Wrapped in its own selector to utilize memorization.
const getStarFilteredLawsByInitial = createSelector(
  [ getLawsByInitial, getFilters, getIndexStars ],
  (laws, filters, stars) => {
    if (filters.get('starred')) {
      laws = laws.filter(law => stars.has(law.get('groupkey')));
    }

    return laws;
  }
);

// Filter laws of the specified initial probably already filtered by starred
// further more by groupkey if requested.
// Wrapped in its own selector to utilize memorization.
const getStarAndKeyFilteredLawsByInitial = createSelector(
  [ getStarFilteredLawsByInitial, getFilters ],
  (laws, filters) => {
    if (filters.get('groupkey')) {
      const needle = filters.get('groupkey', '').toLowerCase();
      laws = laws.filter(law =>
        law.get('groupkey').toLowerCase().indexOf(needle) > -1
      );
    }

    return laws;
  }
);

// Filter laws of the specified initial probably already filtered by starred
// and groupkey further more by title if requested.
// Wrapped in its own selector to utilize memorization.
const getFilteredLaws = createSelector(
  [ getStarAndKeyFilteredLawsByInitial, getFilters ],
  (laws, filters) => {
    if (filters.get('title')) {
      const needle = filters.get('title', '').toLowerCase();
      laws = laws.filter(law =>
        law.get('title').toLowerCase().indexOf(needle) > -1
      );
    }

    return laws;
  }
);

export const getFilteredLawsCount = (state) => getFilteredLaws(state).size;

export const getFilteredLawsByPage = createSelector(
  [ getFilteredLaws, getPage, getPageSize ],
  (laws, page, size) => laws.slice(size * (page-1), size * page)
);
