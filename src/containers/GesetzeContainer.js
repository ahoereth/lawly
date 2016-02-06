import React from 'react';

import { Gesetze } from '../components';


const mockData = [
  { groupkey: 'a', titel: 'Eins' },
  { groupkey: 'b', titel: 'Zwei' },
  { groupkey: 'c', titel: 'Drei' },
  { groupkey: 'd', titel: 'Vier' },
  { groupkey: 'e', titel: 'Fünf' }
];


class GesetzeContainer extends React.Component {
  render() {
    return (
      <Gesetze
        onChoice={this.choice}
        gesetze={mockData}
      />
    );
  }

  choice(gesetz, idx) {
    console.log(idx, gesetz);
  }
}


export default GesetzeContainer;
