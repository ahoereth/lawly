import chai from 'chai';
chai.should();

import React from 'react';

import { shallowRender } from 'helpers/testUtils';
import List from './List';


const children = [
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
];

const props = {
  className: 'list',
};


function testListLevel(ul) {
  ul.type.should.equal('ul');
  ul.props.children.forEach(li => {
    li.type.should.equal('li');
    let children = li.props.children;
    if (typeof children === 'undefined') { return; }

    children.forEach(child => {
      if (typeof child.type === 'undefined') {
        child.should.be.a('boolean');
        child.should.be.false;
      } else if (child.type === 'ul') {
        testListLevel(child);
      } else {
        child.type.should.equal('span');
        child.props.children.should.match(/^level \d item \d$/);
      }
    });
  });
}


describe('List', () => {
  const output = shallowRender(<List {...props}>{children}</List>);

  it('should render a unordered list and pass props down', () => {
    output.type.should.equal('ul');
    output.props.className.should.equal('list');
  });

  it('should create a nested list', () => {
    output.props.children.length.should.equal(4);
    testListLevel(output);
  });
});
