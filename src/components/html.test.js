import { expect } from 'chai';
import React from 'react';
import { render } from 'enzyme';

import Html from './Html';


describe('Html', () => {
  it('should render raw html strings', () => {
    const raw = '<div><h1>Title</h1><p>Paragraph</p></div>';
    const output = render(<Html className='htmlspan'>{raw}</Html>);
    expect(output.find('.htmlspan')).to.have.lengthOf(1);
    expect(output.find('h1').text()).to.equal('Title');
    expect(output.find('p').text()).to.equal('Paragraph');
  });
});
