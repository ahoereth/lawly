import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchLawIndex } from 'redux/modules/laws';
import {
  search,
  getLawsByQueryAndPage,
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
    results: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
    selectPage: PropTypes.func.isRequired,
    star: PropTypes.func.isRequired,
    stars: PropTypes.objectOf(PropTypes.bool).isRequired,
    total: PropTypes.number.isRequired,
  };

  componentDidMount() {
    const { fetched, fetch } = this.props;
    this.componentWillReceiveProps(); // Initialize search on page load.
    fetched || fetch(); // Initialize law data.
  }

  componentWillReceiveProps(nextProps = this.props) {
    const { params, query, search } = nextProps;
    if ((params.query || '') !== query) {
      search(params.query);
    }
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

    if (!results) {
      return <div>Nothing to show...</div>;
    }

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


const mapStateToProps = (state) => {
  const { page, pageSize, query } = state.search;
  const { results, total } = getLawsByQueryAndPage(state);

  return {
    page,
    pageSize,
    query,
    results,
    total,
    fetched: state.laws.index.length > 0,
    stars: getStars(state),
  };
};

const mapDispatchToProps = {
  fetch: fetchLawIndex,
  search,
  selectPage: selectSearchPage,
  star: starLaw,
};


export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
