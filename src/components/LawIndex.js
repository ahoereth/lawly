import React, { PropTypes } from 'react';
import { Grid, Cell } from 'react-mdl';

import LawList from './LawList';
import LawInitialChooser from './LawInitialChooser';


const LawIndex = ({ changeGroup, laws, selectedInitial, initials }) => (
  <Grid>
    <Cell col={1}>
      <LawInitialChooser
        initials={initials}
        selected={selectedInitial}
        onSelect={changeGroup}
      />
    </Cell>
    <Cell col={11}>
      <LawList laws={laws} />
    </Cell>
  </Grid>
);

LawIndex.propTypes = {
  changeGroup: PropTypes.func.isRequired,
  initials: PropTypes.array.isRequired,
  laws: PropTypes.array.isRequired,
  selectedInitial: PropTypes.string,
};


export default LawIndex;
