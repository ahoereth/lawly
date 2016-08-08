/**
 * Enables action creators to return a function which itself dispatches
 * further actions, for example after a promise resolves.
 *
 * @return {Function} Redux Middleware
 */
export default function functionsMiddleware() {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action !== 'function') {
      return next(action);
    }

    return action(dispatch, getState);
  };
}
