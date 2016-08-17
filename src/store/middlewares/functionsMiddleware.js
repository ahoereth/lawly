import { isFunction } from 'lodash';


/**
 * Enables action creators to return a function which itself dispatches
 * further actions, for example after a promise resolves.
 *
 * @return {Function} Redux Middleware
 */
export default function functionsMiddleware() {
  return ({ dispatch, getState }) => next => action => {
    if (!isFunction(action)) {
      return next(action);
    }

    return action(dispatch, getState);
  };
}
