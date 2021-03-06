/* eslint-disable no-shadow */
import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { pick } from 'lodash';

import {
  getPage,
  getPageSize,
  getQuery,
  getResultsByPage,
  getTotal,
  isLoading,
  search,
  selectPage,
} from '~/modules/search';
import { setTitle } from '~/modules/core';
import { Search } from '~/components/search';

const mapStateToProps = state => ({
  loading: isLoading(state),
  page: getPage(state),
  pageSize: getPageSize(state),
  query: getQuery(state),
  results: getResultsByPage(state),
  total: getTotal(state),
});

const mapDispatchToProps = {
  search,
  setTitle,
  selectPage,
};

/* eslint-disable react/no-unused-prop-types */
class SearchContainer extends React.Component {
  static propTypes = {
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number,
    params: PropTypes.shape({
      query: PropTypes.string,
    }).isRequired,
    query: PropTypes.string,
    results: ImmutableTypes.list.isRequired,
    search: PropTypes.func.isRequired,
    selectPage: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
  };

  componentWillMount() {
    this.props.setTitle('Suche');
  }

  componentDidMount() {
    const { search, params, query, selectPage, page } = this.props;
    search(params.query || query); // Initialize search.
    selectPage(params.page ? parseInt(params.page, 10) : page); // Init page.
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const props = pick(this.props, Object.keys(Search.propTypes));
    return <Search {...props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
