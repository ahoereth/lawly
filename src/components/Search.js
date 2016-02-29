import React, { PropTypes } from 'react';
import { Grid, Cell } from 'react-mdl';

import LawList from './LawList';


const Search = ({ results }) => (
  <Grid>
    <Cell col={12}>
      <LawList laws={results.slice(1, 100)} />
    </Cell>
  </Grid>
);

Search.propTypes = {
  results: PropTypes.array.isRequired,
};


export default Search;
