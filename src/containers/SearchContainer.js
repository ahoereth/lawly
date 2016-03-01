import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchLawIndex } from 'redux/modules/laws';
import { search, getLawsByQuery } from 'redux/modules/search';
import { Search } from 'components';


class SearchContainer extends React.Component {
  static propTypes = {
    fetchLawIndex: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      query: PropTypes.string,
    }).isRequired,
    results: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { params, search, fetchLawIndex } = this.props;
    search.query || search(params.query || ''); // Initialize search on page load.
    fetchLawIndex(); // Initialize law data. TODO!
  }

  render() {
    const { loading, results } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return <Search results={results.slice(1, 100)} />;
  }
}


const mapStateToProps = (state) => ({
  results: getLawsByQuery(state),
  loading: !!state.laws.loading,
  query: state.search.query,
});

const mapDispatchToProps = { fetchLawIndex, search };


export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
