import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { fetchLawIndex, getLawIndex } from 'redux/modules/law_index';
import {
  search,
  getLawsByQueryAndPage, getPage, getQuery, getPageSize,
  selectSearchPage,
} from 'redux/modules/search';
import {
  getStars,
  starLaw,
} from 'redux/modules/user';
import { Search } from 'components';


class SearchContainer extends React.Component {
  static propTypes = {
    fetch: PropTypes.func.isRequired,
    fetched: PropTypes.bool.isRequired,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    params: PropTypes.shape({
      query: PropTypes.string,
    }).isRequired,
    query: PropTypes.string,
    results: PropTypes.instanceOf(Immutable.OrderedMap).isRequired,
    search: PropTypes.func.isRequired,
    selectPage: PropTypes.func.isRequired,
    star: PropTypes.func.isRequired,
    stars: PropTypes.objectOf(PropTypes.bool).isRequired,
    total: PropTypes.number.isRequired,
  };

  componentDidMount() {
    const { fetched, search, params, query, selectPage, page  } = this.props;
    fetched || this.props.fetch(); // Initialize law data.
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
  page: getPage(state),
  pageSize: getPageSize(state),
  query: getQuery(state),
  ...getLawsByQueryAndPage(state), // results, total
  fetched: !getLawIndex(state).isEmpty(),
  stars: getStars(state),
});

const mapDispatchToProps = {
  fetch: fetchLawIndex,
  search,
  selectPage: selectSearchPage,
  star: starLaw,
};


export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
