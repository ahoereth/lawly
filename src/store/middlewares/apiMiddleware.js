import { isObject } from 'helpers/utils';


/**
 * Handles actions for executing API calls using ApiClient. The action
 * needs to contain a `type` (*string*) and `promise` (*function*) --
 * the function is passed the current instance of ApiClient.
 *
 * @param  {ApiClient} client
 * @return {Function} Redux Middleware
 */
export default function apiMiddleware(client) {
  return (/* store */) => next => action => {
    const { api, type, payload } = action;

    // Check wheather this is the correct middleware to handle this action.
    if (!api || !type || !isObject(api)) {
      return next(action);
    }

    // Simulate the action.
    next({ type, payload });

    const { method, name } = api;
    return client[method]({ ...payload, name, action: type });
  };
}
