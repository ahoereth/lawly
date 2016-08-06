import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell } from 'react-mdl';

import LawList from './LawList';
import LawIndexLead from './LawIndexLead';
import LawInitialChooser from './LawInitialChooser';
import LawCollectionChooser from './LawCollectionChooser';


const LawIndex = ({
  collection,
  collections,
  filter,
  filters,
  initials,
  laws,
  page,
  pageSize,
  selectCollection,
  selectInitial,
  selectPage,
  selectedInitial,
  star,
  stars,
  total,
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
        total={total}
        filters={filters}
      />
      <LawList
        laws={laws}
        page={page}
        pageSize={pageSize}
        total={total}
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
  collection: ImmutableTypes.mapContains({
    title: PropTypes.string,
  }).isRequired,
  collections: ImmutableTypes.listOf(PropTypes.string),
  filter: PropTypes.func,
  filters: ImmutableTypes.map,
  initials: ImmutableTypes.listOf(PropTypes.string).isRequired,
  laws: ImmutableTypes.list.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  selectCollection: PropTypes.func.isRequired,
  selectInitial: PropTypes.func.isRequired,
  selectPage: PropTypes.func.isRequired,
  selectedInitial: PropTypes.string.isRequired,
  star: PropTypes.func.isRequired,
  stars: ImmutableTypes.map.isRequired,
  total: PropTypes.number.isRequired,
};


export default LawIndex;
