const TOC = 'gesetze/fetch/TOC';
const TOC_SUCCESS = 'gesetze/fetch/TOC_SUCCESS';
const TOC_FAIL = 'gesetze/fetch/TOC_FAIL';

const SINGLE = 'gesetze/fetch/SINGLE';
const SINGLE_SUCCESS = 'gesetze/fetch/SINGLE_SUCCESS';
const SINGLE_FAIL = 'gesetze/fetch/SINGLE_FAIL';


export default function reducer(
  state = {
    loading: false,
    toc: [],
    initials: [],
    groups: {},
    error: '',
  },
  action
) {
  switch (action.type) {
    case TOC:
      return Object.assign({}, state, { loading: true });
    case TOC_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        toc: action.result.toc,
        initials: action.result.initials
      });
    case TOC_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });
    case SINGLE:
      return Object.assign({}, state, {
        loading: true
      });
    case SINGLE_SUCCESS:
      return Object.assign({}, state, {
        groups: Object.assign({}, state.groups, {
          [action.result[0].groupkey]: action.result
        })
      });
    case SINGLE_FAIL:
      return Object.assign({}, state, {
        error: action.error
      });
    default:
      return state;
  }
}


export function toc() {
  console.log('toc called');
  return {
    types: [TOC, TOC_SUCCESS, TOC_FAIL],
    promise: client => client.get('gesetze/toc')
  };
}

export function single(groupkey) {
  return {
    types: [SINGLE, SINGLE_SUCCESS, SINGLE_FAIL],
    promise: client => client.get('gesetze/' + groupkey)
  };
}
