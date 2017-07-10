import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell, Button } from 'react-mdl';

import FilterListIcon from 'react-icons/md/filter-list';

import { getIndexLink } from '~/helpers';
import LawList from './LawList';
import LawIndexLead from './LawIndexLead';
import LawInitialChooser from './LawInitialChooser';
import LawCollectionChooser from './LawCollectionChooser';

const noVerticalMargin = { marginTop: 0, marginBottom: 0 };

const LawIndex = ({
  count,
  collection,
  collections,
  filter,
  filters,
  initials,
  isLoggedin,
  isOnline,
  laws,
  loading,
  page,
  pageSize,
  selectedInitial,
  showToggles,
  star,
  stars,
  togglesVisible,
}) =>
  <Grid>
    <Cell hideDesktop hideTablet hidePhone={togglesVisible} phone={4}>
      <Button
        ripple
        style={{ width: '92%', marginLeft: '4%' }}
        onClick={showToggles}
      >
        Gruppierungsfilter anzeigen <FilterListIcon />
      </Button>
    </Cell>
    <Cell
      col={12}
      tablet={8}
      phone={4}
      hidePhone={!togglesVisible}
      style={noVerticalMargin}
    >
      <LawCollectionChooser
        collections={collections}
        selected={collection.get('title')}
      />
    </Cell>
    <Cell
      col={1}
      tablet={1}
      phone={4}
      hidePhone={!togglesVisible}
      style={noVerticalMargin}
    >
      <LawInitialChooser
        initials={initials}
        selected={selectedInitial}
        collection={collection.get('title')}
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
        nextPageLink={getIndexLink({
          collection: collection.get('title'),
          initial: selectedInitial,
          page: page + 1,
        })}
        page={page}
        pageSize={pageSize}
        prevPageLink={getIndexLink({
          collection: collection.get('title'),
          initial: selectedInitial,
          page: page - 1,
        })}
        total={count}
        star={!isLoggedin ? undefined : star}
        stars={stars}
        filter={filter}
        filters={filters}
      />
    </Cell>
  </Grid>;

LawIndex.propTypes = {
  count: PropTypes.number.isRequired,
  collection: ImmutableTypes.mapContains({
    title: PropTypes.string,
  }).isRequired,
  collections: ImmutableTypes.listOf(PropTypes.string),
  filter: PropTypes.func,
  filters: ImmutableTypes.map,
  initials: ImmutableTypes.listOf(PropTypes.string).isRequired,
  isLoggedin: PropTypes.bool.isRequired,
  isOnline: PropTypes.bool.isRequired,
  laws: ImmutableTypes.list.isRequired,
  loading: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  selectedInitial: PropTypes.string.isRequired,
  showToggles: PropTypes.func.isRequired,
  star: PropTypes.func.isRequired,
  stars: ImmutableTypes.map.isRequired,
  togglesVisible: PropTypes.bool.isRequired,
};

LawIndex.defaultProps = {
  isOnline: true,
  loading: false,
};

export default LawIndex;
