import { createSelector } from 'reselect';
import { Map, List, fromJS } from 'immutable';

import createReducer from 'store/createReducer';
import { isObject } from 'helpers/utils';


export const SCOPE = 'laws';


// ******************************************************************
// ACTIONS
export const FETCH_SINGLE = 'laws/FETCH_SINGLE';
export const SELECT = 'laws/SELECT';



// ******************************************************************
// REDUCERS
export default createReducer(Map({
  laws: Map(), // Map of Lists of Maps
  selected: undefined,
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
  dispatch({ type: SELECT, payload: groupkey });
  return dispatch(fetchLaw(groupkey));
};



// ******************************************************************
// SELECTORS
export const getLaws = state => state.getIn([SCOPE, 'laws']);

export const getSelection = state => state.getIn([SCOPE, 'selected']);

export const getSelected = state => getLaws(state).get(getSelection(state));

export const getNormHierarchy = createSelector(
  [ getSelected ],
  (norms = List()) => {
    let nodes = List(), path = List();
    norms.forEach(norm => {
      const depth = norm.get('enumeration').split('.').length-1;
      if (depth*2 > path.size) {
        path = path.push(nodes.getIn(path).size-1, 'children');
      } else {
        while (depth*2 < path.size) {
          path = path.skipLast(2);
        }
      }

      nodes = nodes.updateIn(path, List(), list => list.push(Map({ norm })));
    });

    return nodes;
  }
);