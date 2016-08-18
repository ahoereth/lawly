import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { pick } from 'lodash';

import {
  search,
  selectPage,
  getPage,
  getPageSize,
  getQuery,
  getResultsByPage,
  getTotal,
} from '~/modules/search';
import {
  star,
  getIndexStars,
} from '~/modules/user';
import { Search } from '~/components';


const mapStateToProps = state => ({
  page: getPage(state),
  pageSize: getPageSize(state),
  query: getQuery(state),
  results: getResultsByPage(state),
  stars: getIndexStars(state),
  total: getTotal(state),
});


const mapDispatchToProps = {
  search,
  star,
  selectPage,
};


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
    star: PropTypes.func.isRequired,
    stars: ImmutableTypes.map.isRequired,
    total: PropTypes.number.isRequired,
  };

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
