import { createSelector } from 'reselect';
import { Map, List, fromJS } from 'immutable';
import { isPlainObject } from 'lodash';

import createReducer from '~/store/createReducer';


const toArray = e => (Array.isArray(e) ? e : [e]);


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
    const data = isPlainObject(payload) ? payload[Object.keys(payload)[0]]
                                        : payload;
    return state.setIn(['laws', data[0].groupkey], fromJS(toArray(data)));
  },
});



// ******************************************************************
// ACTION CREATORS
export const fetchLaw = (groupkey, payload) => ({
  type: FETCH_SINGLE, payload,
  api: { method: 'get', name: 'law', groupkey, cachable: true },
});

export const selectLaw = groupkey => (dispatch, getState) => {
  // Cannot use a selector from law_index here due to circular dependencies.
  const norm = getState().getIn(['law_index', 'laws']).find(
    norm => norm.get('groupkey') === groupkey
  );
  dispatch({ type: SELECT, payload: groupkey });
  return dispatch(fetchLaw(groupkey, norm ? norm.toObject() : undefined));
};


// ******************************************************************
// SELECTORS
export const getLaws = state => state.getIn([SCOPE, 'laws']);

export const getSelection = state => state.getIn([SCOPE, 'selected']);

export const getSelected = state => getLaws(state).get(getSelection(state));

export const getNormHierarchy = createSelector(
  [getSelected],
  (norms = List()) => {
    let nodes = List();
    let path = List();
    norms.forEach(norm => {
      const depth = norm.get('enumeration', '0').split('.').length - 1;
      if ((depth * 2) > path.size) {
        path = path.push(nodes.getIn(path).size - 1, 'children');
      } else {
        while ((depth * 2) < path.size) {
          path = path.skipLast(2);
        }
      }

      nodes = nodes.updateIn(path, List(), list => list.push(Map({ norm })));
    });

    return nodes;
  }
);
