import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import {
  getFilteredLawsByPage, getInitial, getInitials, getPage, getPageSize,
  getFilters, getFilteredLawsCount, getCollection, getCollectionTitles,
  fetchLawIndex,
  selectCollection, selectLawIndexInitial, selectLawIndexPage, filterLawIndex,
} from 'modules/law_index';
import {
  getIndexStars,
  star,
} from 'modules/user';
import { LawIndex } from 'components';
import { isNumeric, toInt } from 'helpers/utils';


class LawIndexContainer extends React.Component {
  static propTypes = {
    collection: ImmutableTypes.map.isRequired,
    collections: ImmutableTypes.listOf(PropTypes.string),
    fetchIndex: PropTypes.func.isRequired,
    filter: PropTypes.func.isRequired,
    filters: ImmutableTypes.map,
    initials: ImmutableTypes.list.isRequired,
    laws: ImmutableTypes.list.isRequired,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    params: PropTypes.shape({
      collectionOrInitial: PropTypes.string,
      initialOrPage: PropTypes.string,
      page: PropTypes.number,
    }).isRequired,
    selectCollection: PropTypes.func.isRequired,
    selectInitial: PropTypes.func.isRequired,
    selectPage: PropTypes.func.isRequired,
    selectedInitial: PropTypes.string,
    star: PropTypes.func.isRequired,
    stars: ImmutableTypes.map.isRequired,
    total: PropTypes.number.isRequired,
  };

  componentWillMount() {
    const {
      fetchIndex,
      total,
      selectCollection,
      selectInitial,
      selectPage,
      params,
    } = this.props;

    const { a, b, c } = params;
    const collection = !isNumeric(b) || a.length > 1 ? a : undefined;
    const initial = isNumeric(b) ? (a.length === 1 ? a : undefined) : b;
    const page = isNumeric(b) ? toInt(b) : toInt(c);

    total > 0 || fetchIndex();
    selectCollection(collection);
    selectInitial(initial);
    selectPage(page);
  }

  render() {
    const {
      collection,
      collections,
      filter,
      filters,
      initials,
      laws,
      page,
      pageSize,
      selectCollection,
      selectedInitial,
      selectInitial,
      selectPage,
      star,
      stars,
      total,
    } = this.props;

    return (
      <LawIndex {...{
        initials, laws, total,
        page, pageSize,
        selectedInitial, selectInitial, selectPage,
        star, stars,
        filter, filters,
        collection, collections, selectCollection,
      }} />
    );
  }
}


const mapStateToProps = (state) => ({
  total: getFilteredLawsCount(state),
  laws: getFilteredLawsByPage(state), // total, laws
  initials: getInitials(state),
  page: getPage(state),
  pageSize: getPageSize(state),
  selectedInitial: getInitial(state),
  stars: getIndexStars(state),
  filters: getFilters(state),
  collections: getCollectionTitles(state),
  collection: getCollection(state),
});

const mapDispatchToProps = {
  fetchIndex: fetchLawIndex,
  selectInitial: selectLawIndexInitial,
  selectPage: selectLawIndexPage,
  filter: filterLawIndex,
  selectCollection,
  star,
};


export default connect(mapStateToProps, mapDispatchToProps)(LawIndexContainer);
