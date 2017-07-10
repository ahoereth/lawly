import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';

import React from 'react';
import Pagination from './Pagination';

chai.use(chaiEnzyme());
chai.use(spies);

describe('Pagination', () => {
  it('renders correct current page infos', () => {
    let wrap = shallow(<Pagination pages={5} selectPage={() => {}} />);
    let state = wrap.find('div').last().find('Button').first().node;
    expect(state.props.children).to.contain(1);
    expect(state.props.children).to.contain(5);

    wrap = shallow(<Pagination page={3} pages={5} selectPage={() => {}} />);
    state = wrap.find('div').last().find('Button').first().node;
    expect(state.props.children).to.contain(3);
    expect(state.props.children).to.contain(5);
  });

  it('renders correct actions on first page', () => {
    const action = chai.spy(p => p);

    const wrap = shallow(<Pagination pages={5} selectPage={action} />);
    const actions = wrap.find('div').first().find('Button');

    actions.at(0).simulate('click'); // Next
    expect(action).to.be.called.once;
    expect(action).to.be.called.with(2);

    actions.at(1).simulate('click'); // End
    expect(action).to.be.called.twice;
    expect(action).to.be.called.with(5);
  });

  it('renders correct actions on second page', () => {
    const action = chai.spy(p => p);

    const wrap = shallow(
      <Pagination page={2} pages={5} selectPage={action} />,
    );
    const actions = wrap.find('div').first().find('Button');

    actions.at(0).simulate('click'); // Prev
    expect(action).to.be.called.once;
    expect(action).to.be.called.with(1);

    actions.at(1).simulate('click'); // Next
    expect(action).to.be.called.twice;
    expect(action).to.be.called.with(3);

    actions.at(2).simulate('click'); // End
    expect(action).to.be.called.exactly(3);
    expect(action).to.be.called.with(5);
  });

  it('renders correct actions on a centered page', () => {
    const action = chai.spy(p => p);

    const wrap = shallow(
      <Pagination page={3} pages={5} selectPage={action} />,
    );
    const actions = wrap.find('div').first().find('Button');

    actions.at(0).simulate('click'); // Start
    expect(action).to.be.called.once;
    expect(action).to.be.called.with(1);

    actions.at(1).simulate('click'); // Prev
    expect(action).to.be.called.twice;
    expect(action).to.be.called.with(2);

    actions.at(2).simulate('click'); // Next
    expect(action).to.be.called.exactly(3);
    expect(action).to.be.called.with(4);

    actions.at(3).simulate('click'); // End
    expect(action).to.be.called.exactly(4);
    expect(action).to.be.called.with(5);
  });

  it('renders correct actions on pre-last page', () => {
    const action = chai.spy(p => p);

    const wrap = shallow(
      <Pagination page={4} pages={5} selectPage={action} />,
    );
    const actions = wrap.find('div').first().find('Button');

    actions.at(0).simulate('click'); // Start
    expect(action).to.be.called.once;
    expect(action).to.be.called.with(1);

    actions.at(1).simulate('click'); // Prev
    expect(action).to.be.called.twice;
    expect(action).to.be.called.with(3);

    actions.at(2).simulate('click'); // End
    expect(action).to.be.called.exactly(3);
    expect(action).to.be.called.with(5);
  });

  it('renders correct actions on last page', () => {
    const action = chai.spy(p => p);

    const wrap = shallow(
      <Pagination page={5} pages={5} selectPage={action} />,
    );
    const actions = wrap.find('div').first().find('Button');

    actions.at(0).simulate('click'); // Start
    expect(action).to.be.called.once;
    expect(action).to.be.called.with(1);

    actions.at(1).simulate('click'); // Prev
    expect(action).to.be.called.twice;
    expect(action).to.be.called.with(4);
  });
});
