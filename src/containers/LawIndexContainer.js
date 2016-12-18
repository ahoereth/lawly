import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { pick, isUndefined, isEqual } from 'lodash';
import { List } from 'immutable';

import {
  getCollection, getCollectionTitles,
  getFilters, getFilteredLawsByPage, getFilteredLawsCount,
  getInitial, getInitials,
  getPage, getPageSize,
  getToggles,
  isLoaded,
  fetchLawIndex,
  filterLawIndex,
  select,
  showToggles,
} from '~/modules/law_index';
import { getIndexStars, isLoggedin, star } from '~/modules/user';
import { getShellMode, setTitle, isOnline } from '~/modules/core';
import { LawIndex } from '~/components/laws';
import { isNumeric as isNum } from '~/helpers/utils';


const mapStateToProps = state => ({
  count: getFilteredLawsCount(state),
  isLoggedin: isLoggedin(state),
  isOnline: isOnline(state),
  laws: getFilteredLawsByPage(state),
  loading: !isLoaded(state),
  initials: getInitials(state),
  page: getPage(state),
  pageSize: getPageSize(state),
  selectedInitial: getInitial(state),
  shells: getShellMode(state),
  stars: getIndexStars(state),
  togglesVisible: getToggles(state),
  filters: getFilters(state),
  collections: getCollectionTitles(state),
  collection: getCollection(state),
});


const mapDispatchToProps = {
  fetchIndex: fetchLawIndex,
  filter: filterLawIndex,
  select,
  setTitle,
  showToggles,
  star,
};


/* eslint-disable react/no-unused-prop-types */
class LawIndexContainer extends React.Component {
  static propTypes = {
    collection: ImmutableTypes.map.isRequired,
    collections: ImmutableTypes.listOf(PropTypes.string),
    count: PropTypes.number.isRequired,
    fetchIndex: PropTypes.func.isRequired,
    filter: PropTypes.func.isRequired,
    filters: ImmutableTypes.map,
    initials: ImmutableTypes.list.isRequired,
    isLoggedin: PropTypes.bool.isRequired,
    isOnline: PropTypes.bool.isRequired,
    laws: ImmutableTypes.list.isRequired,
    loading: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    params: PropTypes.shape({
      collectionOrInitial: PropTypes.string,
      initialOrPage: PropTypes.string,
      page: PropTypes.number,
    }).isRequired,
    select: PropTypes.func.isRequired,
    selectedInitial: PropTypes.string,
    setTitle: PropTypes.func.isRequired,
    shells: PropTypes.bool.isRequired,
    star: PropTypes.func.isRequired,
    stars: ImmutableTypes.map.isRequired,
  };

  componentWillMount(props) {
    this.init(props);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.params, this.props.params)) {
      this.init(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  init(props) {
    const {
      fetchIndex,
      loading,
      select,
      setTitle,
      params,
    } = props || this.props;

    setTitle('Übersicht');

    /* eslint-disable one-var, no-nested-ternary */
    let collection, initial, page;
    const { a, b, c } = params;
    if (!isUndefined(a)) {
      collection = !isNum(a) && a.length > 1 ? a : undefined;
      const aInit = a.length === 1 && (!isNum(a) || isNum(b)) ? a : undefined;
      initial = !aInit && (!isNum(b) || isNum(c)) ? b : aInit;
      page = isNum(c) ? c : isNum(b) ? b : isNum(a) ? a : undefined;
    }
    /* eslint-enable one-var, no-nested-ternary */

    loading && fetchIndex();
    select({ collection, initial, page });
  }

  render() {
    const props = pick(this.props, Object.keys(LawIndex.propTypes));
    const laws = this.props.shells ? List() : this.props.laws;
    return <LawIndex {...props} laws={laws} />;
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(LawIndexContainer);
