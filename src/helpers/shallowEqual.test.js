import { expect } from 'chai';
import { List, Map, Set } from 'immutable';

import shallowEqual from './shallowEqual';


describe('shallowEqual', () => {
  it('determines whether two arguments equal or not', () => {
    expect(shallowEqual('string', 'string')).to.be.true;
    expect(shallowEqual(true, true)).to.be.true;
    expect(shallowEqual(0, -0)).to.be.true;
    expect(shallowEqual(null, null)).to.be.true;
    expect(shallowEqual({}, {})).to.be.true;

    expect(shallowEqual(undefined, null)).to.be.false;
    expect(shallowEqual('string', 'other string')).to.be.false;
  });

  it('handles immutables', () => {
    expect(shallowEqual(List([1, 2, 3]), List([1, 2, 3]))).to.be.true;
    expect(shallowEqual(Map({ a: 1, b: 1 }), Map({ a: 1, b: 1 }))).to.be.true;
    expect(shallowEqual(Set([NaN]), Set([NaN]))).to.be.true;

    expect(shallowEqual(List([1, 2, 4]), List([1, 2, 3]))).to.be.false;
    expect(shallowEqual(List([1]), Set([1]))).to.be.false;
  });
});
