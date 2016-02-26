import expect from 'expect';
import React from 'react';
import {
  createRenderer,
  findRenderedComponentWithType,
} from 'react-addons-test-utils';

import Gesetze from './Gesetze';
import { DataTable, FABButton } from 'react-mdl';


function setup() {
  let props = {
    onChoice: expect.createSpy(),
    gesetze: [
      { groupid: 'A', titel: 'Titel A' },
      { groupid: 'B', titel: 'Titel B' },
      { groupid: 'C', titel: 'Titel C' },
    ]
  };

  let renderer = createRenderer();
  renderer.render(<Gesetze {...props} />);
  let output = renderer.getRenderOutput();

  return {
    props,
    output,
    renderer,
  };
}

describe('components', () => {
  describe('Gesetze', () => {
    it('should render correctly', () => {
      const { output } = setup();

      expect(output.type).toBe('div');
      expect(output.props.className).toBe('gesetze-data-table');

      const table = output.props.children;

      expect(table.type).toBe(DataTable);
      expect(table.props.columns.length).toBe(3);
      expect(table.props.columns[0].name).toBe('groupid');
      expect(table.props.columns[1].name).toBe('titel');
      expect(table.props.columns[2].name).toBe('action');
    });
  });
});
