import { handleActions } from 'redux-actions';


/**
 * Takes an object of action/handler mappings and prefills them with
 * appropriate defaults for handling Flux Standard Actions.
 *
 * If the handler is an object its left unchanged and is expected to containing
 * functions on its `next` and `throw` property.
 *
 * If the handler is a function the function is mapped to the `next` property
 * and the `throw` property filled with a default `payload` to `error` mapping.
 *
 * @param  {object} reducers
 * @param  {object} initialState
 * @return {Reducer}
 */
export default function reduceActions(reducers, initialState) {
  for (let key in reducers) {
    if (
      reducers.hasOwnProperty(key) &&
      typeof reducers[key] === 'function'
    ) {
      const next = reducers[key];
      reducers[key] = {
        next: (state, action) => ({ error: undefined, ...next(state, action) }),
        throw: (state, { payload }) => ({...state, error: payload })
      };
    }
  }

  return handleActions(reducers, initialState);
}
