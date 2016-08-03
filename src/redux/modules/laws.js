import { createSelector } from 'reselect';
import { Map, List, fromJS } from 'immutable';

import createReducer from '../createReducer';
import { isObject } from 'helpers/utils';


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
  [SELECT]: (state, { payload }) => state.set('selected', payload),
  [FETCH_SINGLE]: (state, { payload }) => {
    payload = isObject(payload) ? payload[Object.keys(payload)[0]] : payload;
    return state.setIn(['laws', payload[0].groupkey], fromJS(payload));
  }
});



// ******************************************************************
// ACTION CREATORS
export const fetchLaw = groupkey => ({
  type: FETCH_SINGLE,
  promise: api => api.get({ name: 'law', groupkey, cachable: true })
});

export const selectLaw = groupkey => dispatch => {
  dispatch(fetchLaw(groupkey));
  dispatch({ type: SELECT, payload: groupkey });
};



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
