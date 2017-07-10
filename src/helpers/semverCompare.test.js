import { expect } from 'chai';

import semverCompare from './semverCompare';

describe('semverCompare', () => {
  const chaos = [
    '2.5.10.4159',
    '0.5',
    '0.4.1',
    '1',
    '1.1',
    '2.5.0',
    '2',
    '2.5.10',
    '10.5',
    '1.25.4',
    '1.2.15',
  ];

  const order = [
    '0.4.1',
    '0.5',
    '1',
    '1.1',
    '1.2.15',
    '1.25.4',
    '2',
    '2.5.0',
    '2.5.10',
    '2.5.10.4159',
    '10.5',
  ];

  it('sorts arrays correctly', () => {
    expect(chaos.sort(semverCompare)).to.deep.equal(order);
  });

  it('leaves equal version numbers in place', () => {
    expect(['1', '1.0.0'].sort(semverCompare)).to.deep.equal(['1', '1.0.0']);
    expect(['1.0.0', '1'].sort(semverCompare)).to.deep.equal(['1.0.0', '1']);
  });
});
