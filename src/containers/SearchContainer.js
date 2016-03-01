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
    page: PropTypes.number,
    pageSize: PropTypes.number,
    params: PropTypes.shape({
      query: PropTypes.string,
    }).isRequired,
    results: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
    selectPage: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
  };

  componentWillMount() {
    const { params, search, fetchLawIndex } = this.props;
    search.query || search(params.query || ''); // Initialize search on page load.
    fetchLawIndex(); // Initialize law data. TODO!
  }

  render() {
    const { results, selectPage, total, page, pageSize } = this.props;

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
      />
    );
  }
}


const mapStateToProps = (state) => {
  const { page, pageSize } = state.search;
  const { results, total } = getLawsByQueryAndPage(state);

  return {
    page,
    pageSize,
    results,
    total,
  };
};

const mapDispatchToProps = {
  fetchLawIndex,
  search,
  selectPage: selectSearchPage,
};


export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
