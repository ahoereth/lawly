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
  star,
  stars,
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
      <LawList {...{laws, page, pageSize, total, selectPage, star, stars}} />
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
  star: PropTypes.func.isRequired,
  stars: PropTypes.objectOf(PropTypes.bool).isRequired,
  total: PropTypes.number,
};


export default LawIndex;
