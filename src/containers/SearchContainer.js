import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchToc } from 'redux/modules/gesetze';
import { search, getLawsByQuery } from 'redux/modules/search';
import { Search } from 'components';


class SearchContainer extends React.Component {
  static propTypes = {
    fetchToc: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      query: PropTypes.string,
    }).isRequired,
    results: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { params, search, fetchToc } = this.props;
    search(params.query || ''); // Initialize search on page load.
    fetchToc(); // Initialize law data.
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
  loading: !!state.gesetze.loading,
});

const mapDispatchToProps = { fetchToc, search };


export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
