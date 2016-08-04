import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import {
  search,
  getQuery, getPageSize,
  getLocalResultsByPage,
  getRemoteResultsByPage,
  selectSearchPage,
} from 'redux/modules/search';
import {
  getIndexStars,
  star,
} from 'redux/modules/user';
import { Search } from 'components';


const mapStateToProps = (state) => ({
  local: getLocalResultsByPage(state), // results, total, page
  remote: getRemoteResultsByPage(state), // results, total, page
  pageSize: getPageSize(state),
  query: getQuery(state),
  stars: getIndexStars(state),
});


const mapDispatchToProps = {
  search,
  star,
  selectPage: selectSearchPage,
};


const SearchResultType = PropTypes.shape({
  page: PropTypes.number,
  results: ImmutableTypes.listOf(ImmutableTypes.mapContains({
    enumeration: PropTypes.string,
    groupkey: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired),
  total: PropTypes.number,
}).isRequired;


class SearchContainer extends React.Component {
  static propTypes = {
    local: SearchResultType,
    pageSize: PropTypes.number,
    params: PropTypes.shape({
      query: PropTypes.string,
    }).isRequired,
    query: PropTypes.string,
    remote: SearchResultType,
    search: PropTypes.func.isRequired,
    selectPage: PropTypes.func.isRequired,
    star: PropTypes.func.isRequired,
    stars: ImmutableTypes.map.isRequired,
  };

  componentDidMount() {
    const { search, params, query, selectPage, remote } = this.props;
    search(params.query || query); // Initialize search.
    selectPage(params.page ? parseInt(params.page, 10) : remote.page); // Init page.
  }

  render() {
    const {
      remote,
      // local,
      search,
      selectPage,
      pageSize,
      query,
      star,
      stars,
    } = this.props;

    return (
      <Search
        results={remote.results}
        page={remote.page}
        total={remote.total}
        pageSize={pageSize}
        selectPage={selectPage}
        search={search}
        query={query}
        star={star}
        stars={stars}
      />
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
