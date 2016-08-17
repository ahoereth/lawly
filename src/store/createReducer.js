import * as Immutable from 'immutable';
import { isFunction } from 'lodash';


/**
 * Takes an object of action/handler mappings and prefills them with
 * appropriate defaults for handling Flux Standard Actions.
 *
 *   * If the handler is an object it is expected to contain functions on its
 *     `next` and `throw` property to handle the specific cases itself.
 *   * If the handler is a function, its used as `next` handler directly. In
 *     that case the `throw` handler is a simple `payload` to `error` mapping.
 *   * If no error occured the `error` property is always set to undefined.
 *
 * @param  {object} reducers
 * @param  {object} initialState
 * @return {Reducer}
 */
export default function createReducer(
  initialState,
  handlers,
  constructor = (state) => Immutable.fromJS(state)
) {
  return (rawState = initialState, action) => {
    let state = rawState;
    if (!Immutable.Iterable.isIterable(state)) {
      state = constructor(state);
    }

    const handler = (action && action.type) ? handlers[action.type] : undefined;
    if (!handler) { return state; }

    if (action.error === true) {
      if (isFunction(handler) || !handler.hasOwnProperty('throw')) {
        // Does not have a throw property, we handle the error right here.
        state = state.set('error', action.payload);
      } else {
        // Has a throw property, use unchanged.
        state = handler.throw(state, action);
      }
    } else {
      // Unset the error property.
      state = state.set('error', undefined);

      if (isFunction(handler)) {
        // Handler is a function itself..
        state = handler(state, action);
      } else if (handler.hasOwnProperty('next')) {
        // Handler has an explicit `next` property.
        state = handler.next(state, action);
      } else {
        throw new TypeError('handler is not a function and has no `next` prop');
      }
    }

    if (
      Immutable.Iterable.isIterable(initialState) &&
      !Immutable.Iterable.isIterable(state)
    ) {
      throw new TypeError('Reducers must return Immutable objects.');
    }

    return state;
  };
}
