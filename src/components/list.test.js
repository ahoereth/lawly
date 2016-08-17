import { expect } from 'chai';
import React from 'react';
import { isUndefined } from 'lodash';

import { shallowRender } from 'helpers/testUtils';
import List from './List';


const props = {
  className: 'list',
  children: [
    { name: 'level 0 item 1', items: [
      { name: 'level 1 item 1', items: [] },
      { name: 'level 1 item 2', items: [
        { name: 'level 2 item 1', items: [] },
        { name: 'level 2 item 2' },
      ] },
      { items: [ // level 1 item 3
        { name: 'level 2 item 3', items: [] },
        {},
      ] },
    ] },
    { items: [] }, // 'level 0 item 2'
    { name: 'level 0 item 3' },
    {},
  ],
};


function testListLevel(ul) {
  expect(ul.type).to.equal('ul');
  ul.props.children.forEach(li => {
    expect(li.type).to.equal('li');
    const children = li.props.children;
    if (isUndefined(children)) { return; }

    children.forEach(child => {
      if (isUndefined(child.type)) {
        expect(child).to.be.a('boolean');
        expect(child).to.be.false;
      } else if (child.type === 'ul') {
        testListLevel(child);
      } else {
        expect(child.type).to.equal('span');
        expect(child.props.children).to.match(/^level \d item \d$/);
      }
    });
  });
}


describe('List', () => {
  const { children, ...rest } = props;
  const output = shallowRender(<List {...rest}>{children}</List>);

  it('should render a unordered list and pass props down', () => {
    expect(output.type).to.equal('ul');
    expect(output.props.className).to.equal('list');
  });

  it('should create a nested list', () => {
    expect(output.props.children).to.have.lengthOf(4);
    testListLevel(output);
  });
});
