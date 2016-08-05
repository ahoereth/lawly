import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import {
  search,
  selectSearchPage,
  getPageSize,
  getQuery,
  getResultsByPage,
} from 'redux/modules/search';
import {
  star,
  getIndexStars,
} from 'redux/modules/user';
import { Search } from 'components';


const mapStateToProps = (state) => ({
  ...getResultsByPage(state), // results, total, page
  pageSize: getPageSize(state),
  query: getQuery(state),
  stars: getIndexStars(state),
});


const mapDispatchToProps = {
  search,
  star,
  selectPage: selectSearchPage,
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

  render() {
    const {
      page,
      pageSize,
      query,
      results,
      search,
      selectPage,
      star,
      stars,
      total,
    } = this.props;

    return (
      <Search
        page={page}
        pageSize={pageSize}
        query={query}
        results={results}
        selectPage={selectPage}
        search={search}
        star={star}
        stars={stars}
        total={total}
      />
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
