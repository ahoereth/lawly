import React, { PropTypes } from 'react';
import { Grid, Cell } from 'react-mdl';

import LawList from './LawList';
import SearchInput from './SearchInput';


const Search  = ({
  page,
  pageSize,
  query,
  results,
  search,
  selectPage,
  star,
  stars,
  total
}) => (
  <Grid>
    <Cell col={12}>
      <SearchInput
        search={search}
        query={query}
        style={{width: '100%', textAlign: 'center'}}
      />
    </Cell>
    <Cell col={12}>
      <LawList
        laws={results}
        page={page}
        pageSize={pageSize}
        selectPage={selectPage}
        total={total}
        star={star}
        stars={stars}
      />
    </Cell>
  </Grid>
);

Search.propTypes = {
  page: PropTypes.number,
  pageSize: PropTypes.number,
  query: PropTypes.string,
  results: PropTypes.array.isRequired,
  search: PropTypes.func.isRequired,
  selectPage: PropTypes.func.isRequired,
  star: PropTypes.func.isRequired,
  stars: PropTypes.objectOf(PropTypes.bool).isRequired,
  total: PropTypes.number.isRequired,
};


export default Search;
