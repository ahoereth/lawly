import React, { PropTypes } from 'react';
import { Grid, Cell } from 'react-mdl';

import LawList from './LawList';
import LawInitialChooser from './LawInitialChooser';


const Gesetze = ({ changeGroup, gesetze, selectedInitial, initials }) => (
  <Grid>
    <Cell col={1}>
      <LawInitialChooser
        initials={initials}
        selected={selectedInitial}
        onSelect={changeGroup}
      />
    </Cell>
    <Cell col={11} className='gesetze-data-table'>
      <LawList laws={gesetze} />
    </Cell>
  </Grid>
);

Gesetze.propTypes = {
  changeGroup: PropTypes.func.isRequired,
  gesetze: PropTypes.array.isRequired,
  initials: PropTypes.array.isRequired,
  selectedInitial: PropTypes.string,
};


export default Gesetze;
