import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell } from 'react-mdl';

import LawList from './LawList';
import LawIndexLead from './LawIndexLead';
import LawInitialChooser from './LawInitialChooser';
import LawCollectionChooser from './LawCollectionChooser';
import { lawlist } from './lawIndex.sss';


const LawIndex = ({
  count,
  collection,
  collections,
  filter,
  filters,
  initials,
  isOnline,
  laws,
  loading,
  page,
  pageSize,
  selectCollection,
  selectInitial,
  selectPage,
  selectedInitial,
  star,
  stars,
}) => (
  <Grid>
    <Cell col={12} tablet={8} phone={4}>
      <LawCollectionChooser
        collections={collections}
        selected={collection.get('title')}
        onSelect={selectCollection}
      />
    </Cell>
    <Cell col={1} tablet={1} phone={4}>
      <LawInitialChooser
        initials={initials}
        selected={selectedInitial}
        onSelect={selectInitial}
      />
    </Cell>
    <Cell col={11} tablet={7} phone={4}>
      <LawIndexLead
        collection={collection}
        initial={selectedInitial}
        page={page}
        pageSize={pageSize}
        count={count}
        filters={filters}
      />
      <LawList
        disableUnstarred={!isOnline}
        laws={laws}
        loading={!laws.size && loading}
        page={page}
        pageSize={pageSize}
        total={count}
        selectPage={selectPage}
        star={star}
        stars={stars}
        filter={filter}
        filters={filters}
      />
    </Cell>
  </Grid>
);


LawIndex.propTypes = {
  count: PropTypes.number.isRequired,
  collection: ImmutableTypes.mapContains({
    title: PropTypes.string,
  }).isRequired,
  collections: ImmutableTypes.listOf(PropTypes.string),
  filter: PropTypes.func,
  filters: ImmutableTypes.map,
  initials: ImmutableTypes.listOf(PropTypes.string).isRequired,
  isOnline: PropTypes.bool.isRequired,
  laws: ImmutableTypes.list.isRequired,
  loading: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  selectCollection: PropTypes.func.isRequired,
  selectInitial: PropTypes.func.isRequired,
  selectPage: PropTypes.func.isRequired,
  selectedInitial: PropTypes.string.isRequired,
  star: PropTypes.func.isRequired,
  stars: ImmutableTypes.map.isRequired,
};


LawIndex.defaultProps = {
  isOnline: true,
  loading: false,
};


export default LawIndex;
