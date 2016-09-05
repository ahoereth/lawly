import { expect } from 'chai';

import React from 'react';
import { fromJS } from 'immutable';
import { shallow, render } from 'enzyme';

import NormList from './NormList';
import { getNormLink } from '~/helpers';

/* eslint-disable max-len */
const props = {
  nodes: fromJS([
    { norm: { groupkey: 'a/b', enumeration: '0', title: 'Citron' } },
    { norm: { groupkey: 'a/b', enumeration: '1', title: 'Clementine' }, children: [
      { norm: { groupkey: 'a/b', enumeration: '1.1', title: 'Grapefruit' } },
      { norm: { groupkey: 'a/b', enumeration: '1.2', title: 'Blood Orange' }, children: [
        { norm: { groupkey: 'a/b', enumeration: '1.2.1', title: 'Kumquat' } },
      ] },
    ] },
    { norm: { groupkey: 'a/b', enumeration: '2', title: 'Lemon' } },
    { norm: { groupkey: 'a/b', enumeration: '3', title: 'Lime' }, children: [
      { norm: { groupkey: 'a/b', enumeration: '3.1', title: 'Mandarin' }, children: [
        { norm: { groupkey: 'a/b', enumeration: '3.1.1', title: 'Orange' } },
        { norm: { groupkey: 'a/b', enumeration: '3.1.2', title: 'Pomelo' } },
      ] },
    ] },
    { norm: { groupkey: 'a/b', enumeration: '3.2', title: 'Tangerine' } },
  ]),
};

describe('NormList', () => {
  const output = render(<NormList {...props} />);
  const wrapper = shallow(<NormList {...props} />);

  it('does include the lead norm', () => {
    expect(output.text()).to.contain('Citron');
  });

  it('all items have a link', () => {
    expect(wrapper.children()).to.have.lengthOf(5);
    wrapper.find('>li').forEach(li => {
      expect(li.find('Link')).to.have.lengthOf(1);
    });
  });

  it('links norms to their slug hashes', () => {
    const norm0 = props.nodes.getIn([0, 'norm']);
    const item0 = wrapper.find('Link').first().props();
    expect(item0).to.have.property('to', getNormLink(...norm0.toArray()));
    expect(item0).to.have.property('children', norm0.get('title'));
  });

  it('correctly nests using itself recursivley', () => {
    expect(wrapper.childAt(1).find('NormList')).to.have.lengthOf(1);
    expect(wrapper.childAt(3).find('NormList')).to.have.lengthOf(1);
  });
});
