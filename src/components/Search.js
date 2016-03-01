import React, { PropTypes } from 'react';
import { Grid, Cell } from 'react-mdl';

import LawList from './LawList';


const Search = ({ page, pageSize, results, selectPage, total }) => (
  <Grid>
    <Cell col={12}>
      <LawList
        laws={results}
        page={page}
        pageSize={pageSize}
        selectPage={selectPage}
        total={total}
      />
    </Cell>
  </Grid>
);

Search.propTypes = {
  page: PropTypes.number,
  pageSize: PropTypes.number,
  results: PropTypes.array.isRequired,
  selectPage: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};


export default Search;
