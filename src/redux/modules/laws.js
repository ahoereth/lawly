import { createSelector } from 'reselect';
import { Map, List, fromJS } from 'immutable';

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

export const getNorms = (state: any) => (
  state.getIn(['laws', 'laws', state.getIn(['laws', 'selected'])])
);

export const getNormHierarchy = createSelector(
  [ getNorms ],
  (norms = List()) => {
    let nodes = List(), path = List();
    norms.forEach(norm => {
      const depth = norm.get('enumeration').split('.').length - 1;
      if (depth*2 > path.size) {
        path = path.push(nodes.getIn(path).size-1, 'children');
      } else if (depth*2 < path.size) {
        path = path.skipLast(2);
      }

      nodes = nodes.updateIn(path, List(), list => list.push(Map({ norm })));
    });

    return nodes;
  }
);
