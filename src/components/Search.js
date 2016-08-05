import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
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
  total,
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
        star={star}
        stars={stars}
        total={total}
      />
    </Cell>
  </Grid>
);

Search.propTypes = {
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number,
  query: PropTypes.string,
  results: ImmutableTypes.list.isRequired,
  search: PropTypes.func.isRequired,
  selectPage: PropTypes.func.isRequired,
  star: PropTypes.func.isRequired,
  stars: ImmutableTypes.map.isRequired,
  total: PropTypes.number.isRequired,
};


export default Search;
