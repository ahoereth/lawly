/**
 * Handles actions for executing API calls using ApiClient. The action
 * needs to contain a `type` (*string*) and `promise` (*function*) --
 * the function is passed the current instance of ApiClient.
 *
 * @param  {ApiClient} client
 * @return {Function} Redux Middleware
 */
export default function promiseMiddleware(client) {
  return (/* store */) => next => action => {
    const { promise, type } = action;
    if (!type || !promise || typeof promise !== 'function') {
      return next(action);
    }

    return promise(client).then(
      result => next({ type, payload: result }),
      error => next({
        type, error: true,
        payload: error instanceof Error ? error.toString() : error,
      })
    );
  };
}
