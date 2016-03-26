import chai from 'chai';
chai.should();

import React from 'react';
import { renderToStaticMarkup as staticRender } from 'react-dom/server';

import { shallowRender } from 'helpers/testUtils';
import NormList from './NormList';

const props = {
  norms: [
    { enumeration: '0', title: 'Lead Norm' },
    { enumeration: '1', title: 'Norm 1' },
    { enumeration: '1.1', title: 'Norm 1.1' },
    { enumeration: '1.2', title: 'Norm 1.2' },
    { enumeration: '1.2.1', title: 'Norm 1.2.1' },
  ],
};


describe('component', () => {
  describe('NormList', () => {
    const output = shallowRender(<NormList {...props} />);
    const htmlOutput = staticRender(output);

    it('correctly nests norms', () => {
      const norm1 = output.props.children[0];
      norm1.items.length.should.equal(2);

      const norm12 = norm1.items[1];
      norm12.items.length.should.equal(1);
    });

    it('links norms to their slug hashes', () => {
      // TODO
    });

    it('does not list the lead norm', () => {
      htmlOutput.should.not.include('Lead Norm');
    });
  });
});
