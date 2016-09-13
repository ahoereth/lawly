import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell } from 'react-mdl';

import { LawList } from '~/components';
import SearchInput from './SearchInput';


const Search = ({
  loading,
  page,
  pageSize,
  query,
  results,
  search,
  selectPage,
  total,
}) => (
  <Grid>
    <Cell col={12}>
      <SearchInput
        search={search}
        query={query}
        style={{ width: '100%', textAlign: 'center' }}
      />
    </Cell>
    <Cell col={12}>
      <LawList
        emptysetMessage={!query ? 'Gib oben deine Suchanfrage ein.' :
          'Für den aktuellen Suchbegirff gibt es keine Ergebnisse'}
        laws={results}
        loading={loading}
        page={page}
        pageSize={pageSize}
        selectPage={selectPage}
        total={total}
      />
    </Cell>
  </Grid>
);

Search.propTypes = {
  loading: PropTypes.bool,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number,
  query: PropTypes.string,
  results: ImmutableTypes.list.isRequired,
  search: PropTypes.func.isRequired,
  selectPage: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};


export default Search;
