import { isFunction } from 'lodash';


export default function fetchMiddleware(client) {
  return ({ dispatch, getState }) => next => action => {
    if (isFunction(action)) {
      return action(dispatch, getState);
    }

    const { promise, types, ...rest } = action;
    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ ...rest, type: REQUEST });
    return promise(client).then(
      result => next({ ...rest, result, type: SUCCESS }),
      error => next({ ...rest, error, type: FAILURE })
    ).catch(error => {
      // eslint-disable-next-line no-console
      console.error('MIDDLEWARE ERROR:', error);
      next({ ...rest, error, type: FAILURE });
    });
  };
}
