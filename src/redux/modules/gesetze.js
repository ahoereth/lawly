const TOC = 'gesetze/fetch/TOC';
const TOC_SUCCESS = 'gesetze/fetch/TOC_SUCCESS';
const TOC_FAIL = 'gesetze/fetch/TOC_FAIL';


export default function reducer(
  state = {
    loading: false,
    toc: [],
    initials: []
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
