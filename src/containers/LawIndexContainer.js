import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { pick, isUndefined } from 'lodash';
import { List } from 'immutable';

import {
  getCollection, getCollectionTitles,
  getFilters, getFilteredLawsByPage, getFilteredLawsCount,
  getInitial, getInitials,
  getPage, getPageSize,
  isLoaded,
  fetchLawIndex,
  filterLawIndex,
  selectCollection, selectLawIndexInitial, selectLawIndexPage,
} from '~/modules/law_index';
import { getIndexStars, star } from '~/modules/user';
import { getShellMode, setTitle } from '~/modules/core';
import { LawIndex } from '~/components';
import { isNumeric as isNum } from '~/helpers/utils';


const mapStateToProps = state => ({
  count: getFilteredLawsCount(state),
  isLoaded: isLoaded(state),
  laws: getFilteredLawsByPage(state),
  initials: getInitials(state),
  page: getPage(state),
  pageSize: getPageSize(state),
  selectedInitial: getInitial(state),
  shells: getShellMode(state),
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
  setTitle,
  star,
};


class LawIndexContainer extends React.Component {
  static propTypes = {
    collection: ImmutableTypes.map.isRequired,
    collections: ImmutableTypes.listOf(PropTypes.string),
    count: PropTypes.number.isRequired,
    fetchIndex: PropTypes.func.isRequired,
    filter: PropTypes.func.isRequired,
    filters: ImmutableTypes.map,
    initials: ImmutableTypes.list.isRequired,
    isLoaded: PropTypes.bool.isRequired,
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
    setTitle: PropTypes.func.isRequired,
    shells: PropTypes.bool.isRequired,
    star: PropTypes.func.isRequired,
    stars: ImmutableTypes.map.isRequired,
  };

  componentWillMount() {
    const {
      fetchIndex,
      isLoaded,
      selectCollection,
      selectInitial,
      selectPage,
      setTitle,
      params,
    } = this.props;

    setTitle('Übersicht');

    /* eslint-disable one-var, no-nested-ternary */
    let collection, initial, page;
    const { a, b, c } = params;
    if (!isUndefined(a)) {
      collection = !isNum(a) && a.length > 1 ? a : undefined;
      // Hack for numeric initials: When initial is numeric, always show page.
      const aInit = a.length === 1 && (!isNum(a) || isNum(b)) ? a : undefined;
      initial = !aInit && (!isNum(b) || isNum(c)) ? b : aInit;
      page = isNum(c) ? c : isNum(b) ? b : isNum(a) ? a : undefined;
    }
    /* eslint-enable one-var, no-nested-ternary */

    isLoaded || fetchIndex();
    selectCollection(collection);
    selectInitial(initial);
    selectPage(page);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const props = pick(this.props, Object.keys(LawIndex.propTypes));
    const laws = this.props.shells ? List() : this.props.laws;
    return <LawIndex {...props} laws={laws} />;
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(LawIndexContainer);
