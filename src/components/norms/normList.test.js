import { expect } from 'chai';

import React from 'react';
import { fromJS } from 'immutable';
import { renderToStaticMarkup as staticRender } from 'react-dom/server';

import { shallowRender } from 'helpers/testUtils';
import { slugify } from 'helpers/utils';
import NormList from './NormList';

const props = {
  nodes: fromJS([
    { norm: { enumeration: '0', title: 'Citron' } },
    { norm: { enumeration: '1', title: 'Clementine' }, children: [
      { norm: { enumeration: '1.1', title: 'Grapefruit' } },
      { norm: { enumeration: '1.2', title: 'Blood Orange' }, children: [
        { norm: { enumeration: '1.2.1', title: 'Kumquat' } },
      ] },
    ] },
    { norm: { enumeration: '2', title: 'Lemon' } },
    { norm: { enumeration: '3', title: 'Lime' }, children: [
      { norm: { enumeration: '3.1', title: 'Mandarin' }, children: [
        { norm: { enumeration: '3.1.1', title: 'Orange' } },
        { norm: { enumeration: '3.1.2', title: 'Pomelo' } },
      ] },
    ] },
    { norm: { enumeration: '3.2', title: 'Tangerine' } },
  ]),
};

describe('NormList', () => {
  const output = shallowRender(<NormList {...props} />);
  const baseLIs = output.props.children;
  const [clemA, clemUL] = baseLIs.get(1).props.children;

  it('correctly nests norms', () => {
    expect(baseLIs).to.have.ownProperty('size', 4);

    expect(clemA).to.have.property('type', 'a');
    expect(clemA).to.have.deep.property('props.children', 'Clementine');
    expect(clemUL).to.have.property('type', 'ul');
    expect(clemUL).to.have.deep.property('props.children.size', 2);

    const [limeA, limeUL] = baseLIs.get(3).props.children;
    expect(limeA).to.have.property('type', 'a');
    expect(limeA).to.have.deep.property('props.children', 'Lime');
    expect(limeUL).to.have.property('type', 'ul');
    expect(limeUL).to.have.deep.property('props.children.size', 1);

    const [mandA, mandUL] = limeUL.props.children.first().props.children;
    expect(mandA).to.have.ownProperty('type', 'a');
    expect(mandA).to.have.deep.property('props.children', 'Mandarin');
    expect(mandUL).to.have.property('type', 'ul');
    expect(mandUL).to.have.deep.property('props.children.size', 2);
  });

  it('links norms to their slug hashes', () => {
    const clemslug = slugify(clemA.props.children);
    expect(clemA).to.have.property('type', 'a');
    expect(clemA).to.have.deep.property('props.href', `#${clemslug}`);
  });

  it('does include the lead norm', () => {
    const htmlOutput = staticRender(output);
    expect(htmlOutput).to.include('Citron');
  });
});
