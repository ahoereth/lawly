import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchLawIndex } from 'redux/modules/laws';
import {
  search,
  getLawsByQueryAndPage,
  selectSearchPage,
} from 'redux/modules/search';
import { Search } from 'components';


class SearchContainer extends React.Component {
  static propTypes = {
    fetchLawIndex: PropTypes.func.isRequired,
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
    total: PropTypes.number.isRequired,
  };

  componentDidMount() {
    const { fetched, fetchLawIndex } = this.props;
    this.componentWillReceiveProps(); // Initialize search on page load.
    fetched || fetchLawIndex(); // Initialize law data.
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
    fetched: state.laws.index.length > 0
  };
};

const mapDispatchToProps = {
  fetchLawIndex,
  search,
  selectPage: selectSearchPage,
};


export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
