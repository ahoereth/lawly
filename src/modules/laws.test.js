import { expect } from 'chai';
import { Map, List, fromJS } from 'immutable';

import mockStore, { mockApi } from 'store/mockStore';
import reducer, {
  SCOPE,

  FETCH_SINGLE,
  SELECT,
  fetchLaw,
  selectLaw,

  getLaws,
  getSelection,
  getSelected,
  getNormHierarchy,
} from './laws';


describe('laws', () => {
  const localState = Map({
    laws: Map(), // Map of Lists of Maps
    selected: undefined,
  });

  const initialState = Map({
    [SCOPE]: localState,
  });


  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).to.equal(localState);
    });

    it('should handle FETCH_SINGLE', () => {
      const a = { groupkey: 'a', n: 1 }, b = { groupkey: 'a', n: 2 };
      const state = reducer({}, { type: FETCH_SINGLE, payload: [ a, b ] });
      expect(state.get('laws')).to.equal(Map({ a: List([ Map(a), Map(b) ]) }));
    });

    it('should handle SELECT', () => {
      const state = reducer({}, { type: SELECT, payload: 'a' });
      expect(state.get('selected')).to.equal('a');
    });
  });


  describe('actions', () => {
    it('fetchLaw() should dispatch FETCH_SINGLE', (done) => {
      const action = { type: FETCH_SINGLE, payload: { groupkey: 'foo' } };
      const store = mockStore(initialState);
      mockApi.reset(({ groupkey }) => Promise.resolve({ groupkey }));
      store.dispatch(fetchLaw('foo')).then((dispatchedAction) => {
        expect(mockApi.get).to.be.called.once;
        expect(dispatchedAction).to.deep.equal(action);
      }).then(done, done);
    });

    it('selectLaw() should dispatch SELECT', () => {
      const action = { type: 'laws/SELECT', payload: 'foo' };
      const store = mockStore(initialState);
      store.dispatch(selectLaw('foo'));
      expect(store.getActions()).to.deep.contain(action);
    });
  });


  describe('selectors', () => {
    it('should provide getLaws()', () => {
      const laws = Map({ BGB: Map({ groupkey: 'BGB' }) });
      const state = initialState.setIn([SCOPE, 'laws'], laws);
      expect(getLaws(state)).to.equal(laws);
    });

    it('should provide getSelection()', () => {
      const state = initialState.setIn([SCOPE, 'selected'], 'foo');
      expect(getSelection(state)).to.equal('foo');
    });

    it('should provide getSelected()', () => {
      const laws = fromJS({ a: [{ groupkey: 'a' }], b: [{ groupkey: 'b' }] });
      const state = initialState.mergeIn([SCOPE], Map({selected: 'b', laws}));
      expect(getSelected(state)).to.equal(laws.get('b'));
    });

    it('should provide getNormHierarchy()', () => {
      const laws = fromJS({ foo: [
        { enumeration: '0' },
        { enumeration: '1' },
        { enumeration: '1.1' },
        { enumeration: '1.2' },
        { enumeration: '1.2.1' },
        { enumeration: '2' },
        { enumeration: '3' },
        { enumeration: '3.1' },
        { enumeration: '3.1.1' },
        { enumeration: '3.1.2' },
        { enumeration: '3.2' },
      ]});
      const hierarchy = fromJS([
        { norm: { enumeration: '0' } },
        { norm: { enumeration: '1' }, children: [
          { norm: { enumeration: '1.1' } },
          { norm: { enumeration: '1.2' }, children: [
            { norm: { enumeration: '1.2.1' } },
          ]}
        ]},
        { norm: { enumeration: '2' } },
        { norm: { enumeration: '3' }, children: [
          { norm: { enumeration: '3.1' }, children: [
            { norm: { enumeration: '3.1.1' } },
            { norm: { enumeration: '3.1.2' } },
          ]},
          { norm: { enumeration: '3.2' } },
        ]}
      ]);
      const state = initialState.mergeIn([SCOPE], Map({selected: 'foo', laws}));
      expect(getNormHierarchy(state)).to.equal(hierarchy);
    });
  });
});
