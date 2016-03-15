import expect from 'expect';
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
  expect(ul.type).toBe('ul');
  ul.props.children.forEach(li => {
    expect(li.type).toBe('li');
    let children = li.props.children;
    if (typeof children === 'undefined') { return; }

    children.forEach(child => {
      if (typeof child.type === 'undefined') {
        expect(child).toBeA('boolean');
        expect(child).toEqual(false);
      } else if (child.type === 'ul') {
        testListLevel(child);
      } else {
        expect(child.type).toBe('span');
        expect(child.props.children).toMatch(/^level \d item \d$/);
      }
    });
  });
}


describe('component', () => {
  describe('List', () => {
    const output = shallowRender(<List {...props}>{children}</List>);

    it('should render a unordered list and pass props down', () => {
      expect(output.type).toBe('ul');
      expect(output.props.className).toBe('list');
    });

    it('should create a nested list', () => {
      expect(output.props.children.length).toBe(4);
      testListLevel(output);
    });
  });
});
