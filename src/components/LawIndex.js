import React, { PropTypes } from 'react';
import { Grid, Cell } from 'react-mdl';

import LawList from './LawList';
import LawInitialChooser from './LawInitialChooser';


const LawIndex = ({
  initials,
  laws,
  page,
  pageSize,
  selectInitial,
  selectPage,
  selectedInitial,
  total,
}) => (
  <Grid>
    <Cell col={1} tablet={1} phone={4}>
      <LawInitialChooser
        initials={initials}
        selected={selectedInitial}
        onSelect={selectInitial}
      />
    </Cell>
    <Cell col={11} tablet={7} phone={4}>
      <LawList
        laws={laws}
        page={page}
        pageSize={pageSize}
        total={total}
        selectPage={selectPage}
      />
    </Cell>
  </Grid>
);

LawIndex.propTypes = {
  initials: PropTypes.array.isRequired,
  laws: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  selectInitial: PropTypes.func.isRequired,
  selectPage: PropTypes.func.isRequired,
  selectedInitial: PropTypes.string,
  total: PropTypes.number,
};


export default LawIndex;
