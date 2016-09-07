import { isPlainObject } from 'lodash';


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
    if (!api || !type || !isPlainObject(api)) {
      return next(action);
    }

    // Simulate the action.
    if (payload) {
      next({ type, payload });
    }

    const { method, name, ...rest } = api;
    if (!name) {
      throw new Error('no API resource name given');
    }

    return client[method]({ ...payload, ...rest, name, action: type });
  };
}
