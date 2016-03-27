import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';

chai.use(chaiEnzyme());
chai.use(spies);

import React from 'react';
import SearchInput from './SearchInput';


describe('SearchInput', () => {
  it('passes the query to the search function', () => {
    const action = chai.spy(p => p);
    const wrap = shallow(<SearchInput search={action} />);
    wrap.simulate('change', { currentTarget: { value: 'text' }});
    expect(action).to.be.called.once;
    expect(action).to.be.called.with('text');
  });

  it('accepts an external query string', () => {
    const wrap = shallow(<SearchInput search={() => {}} query='text' />);
    expect(wrap.find('Textfield').node.props.value).to.equal('text');
  });
});
