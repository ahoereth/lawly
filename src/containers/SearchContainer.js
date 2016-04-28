import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import {
  search,
  getResultsByPage, getPage, getQuery, getPageSize,
  selectSearchPage,
} from 'redux/modules/search';
import {
  getIndexStars,
  star,
} from 'redux/modules/user';
import { Search } from 'components';


class SearchContainer extends React.Component {
  static propTypes = {
    page: PropTypes.number,
    pageSize: PropTypes.number,
    params: PropTypes.shape({
      query: PropTypes.string,
    }).isRequired,
    query: PropTypes.string,
    results: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      groupkey: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      enumeration: PropTypes.string,
    })).isRequired,
    search: PropTypes.func.isRequired,
    selectPage: PropTypes.func.isRequired,
    star: PropTypes.func.isRequired,
    stars: ImmutablePropTypes.setOf(PropTypes.string).isRequired,
    total: PropTypes.number.isRequired,
  };

  componentDidMount() {
    const { search, params, query, selectPage, page  } = this.props;
    search(params.query || query); // Initialize search.
    selectPage(params.page ? parseInt(params.page, 10) : page); // Init page.
  }

  render() {
    const {
      results,
      search,
      selectPage,
      total,
      page,
      pageSize,
      query,
      star,
      stars,
    } = this.props;

    return (
      <Search
        results={results}
        page={page}
        pageSize={pageSize}
        selectPage={selectPage}
        total={total}
        search={search}
        query={query}
        star={star}
        stars={stars}
      />
    );
  }
}


const mapStateToProps = (state) => ({
  ...getResultsByPage(state), // results, total
  page: getPage(state),
  pageSize: getPageSize(state),
  query: getQuery(state),
  stars: getIndexStars(state),
});

const mapDispatchToProps = {
  search,
  star,
  selectPage: selectSearchPage,
};


export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
