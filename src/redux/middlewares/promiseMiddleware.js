/**
 * Handles actions for executing API calls using ApiClient. The action
 * needs to contain a `type` (*string*) and `promise` (*function*) --
 * the function is passed the current instance of ApiClient.
 *
 * @param  {ApiClient} client
 * @return {Function} Redux Middleware
 */
export default function apiMiddleware(client) {
  return (/*store*/) => {
    return next => action => {
      if (
        !action.promise ||
        !action.type ||
        typeof action.promise !== 'function'
      ) {
        return next(action);
      }

      const { promise, type } = action;
      return promise(client)
        .then(result => next({ type, payload: result }))
        .catch(err => next({ type, error: true,
          payload: err instanceof Error ? err.toString() : err
        }));
    };
  };
}
