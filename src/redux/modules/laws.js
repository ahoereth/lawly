import { createSelector } from 'reselect';
import { Map, fromJS } from 'immutable';

import createReducer from '../createReducer';


// ******************************************************************
// ACTIONS
export const FETCH_SINGLE = 'laws/FETCH_SINGLE';
export const SELECT = 'laws/SELECT';



// ******************************************************************
// REDUCERS
export default createReducer(Map({
  laws: Map(), // Map of Lists of Maps
  selected: undefined,
  error: undefined,
}), {
  [SELECT]: (state, { payload }) => {
    const groupkey = Object.keys(payload)[0];
    return state
      .set('selected', groupkey)
      .setIn(['laws', groupkey], fromJS(payload[groupkey]));
  },
  [FETCH_SINGLE]: (state, { payload }) => {
    const groupkey = Object.keys(payload)[0];
    return state.setIn(['laws', groupkey], fromJS(payload[groupkey]));
  }
});



// ******************************************************************
// ACTION CREATORS
export const selectLaw = (groupkey) => ({
  type: SELECT,
  promise: api => api.get({ name: 'law', groupkey, cachable: true })
});

export const fetchLaw = (groupkey) => ({
  type: FETCH_SINGLE,
  promise: api => api.get({ name: 'law', groupkey, cachable: true })
});



// ******************************************************************
// SELECTORS
export const getLaws = (state) => state.getIn(['laws', 'laws']);

export const getNorms = (state) => (
  state.getIn(['laws', 'laws', state.getIn(['laws', 'selected'])])
);

export const getNormHierarchy = createSelector(
  [ getNorms ],
  (norms) => {
    if (typeof norms === 'undefined') { return []; }

    let list = [];
    norms.forEach(norm => {
      let level = norm.get('enumeration').split('.').length - 1;
      let currentList = list;
      while (0 < (level--)) {
        if (!currentList[currentList.length-1]) {
          currentList.push({ children: [] });
        }
        currentList = currentList[currentList.length-1].children;
      }

      currentList.push({
        norm: norm,
        children: []
      });
    });

    return list;
  }
);
