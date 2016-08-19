import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { pick, isUndefined } from 'lodash';

import {
  getFilteredLawsByPage, getInitial, getInitials, getPage, getPageSize,
  getFilters, getFilteredLawsCount, getCollection, getCollectionTitles,
  fetchLawIndex,
  selectCollection, selectLawIndexInitial, selectLawIndexPage, filterLawIndex,
} from '~/modules/law_index';
import { viewLaw } from '~/modules/laws';
import { getIndexStars, star } from '~/modules/user';
import { LawIndex } from '~/components';
import { isNumeric as isNum } from '~/helpers/utils';


const mapStateToProps = state => ({
  total: getFilteredLawsCount(state),
  laws: getFilteredLawsByPage(state),
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
  viewLaw,
};


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
    viewLaw: PropTypes.func.isRequired,
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

    // eslint-disable-next-line one-var, one-var-declaration-per-line
    let collection, initial, page;
    const { a, b, c } = params;
    if (!isUndefined(a)) {
      collection = !isNum(a) && a.length > 1 ? a : undefined;
      // Hack for numeric initials: When initial is set, page is always defined.
      const aAsInitial = !isNum(a) && a.length === 1 ? a : undefined;
      initial = isUndefined(b) || isUndefined(c) ? aAsInitial : b;
      // eslint-disable-next-line no-nested-ternary
      page = isNum(c) ? c : (isNum(b) ? b : (isNum(a) ? a : undefined));
    }

    total > 0 || fetchIndex();
    selectCollection(collection);
    selectInitial(initial);
    selectPage(page);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const props = pick(this.props, Object.keys(LawIndex.propTypes));
    return <LawIndex {...props} />;
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(LawIndexContainer);
