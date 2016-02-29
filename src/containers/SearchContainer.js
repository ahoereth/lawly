import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchToc } from 'redux/modules/gesetze';
import { search } from 'redux/modules/search';
import { Gesetze } from 'components';


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

    return <Gesetze gesetze={results.slice(1, 100)} />;
  }
}


const getLaws = (state) => state.gesetze.toc;
const getQuery = (state) => (state.search.query || '').toLowerCase();

const getLawsByQuery = createSelector(
  [ getLaws, getQuery ],
  (laws, query) => laws.filter(law => (
    (law.titel.toLowerCase().indexOf(query) > -1) ||
    (law.groupkey.toLowerCase().indexOf(query) > -1)
  ))
);

const mapStateToProps = (state) => {
  return {
    results: getLawsByQuery(state),
    loading: !!state.gesetze.loading,
  };
};

const mapDispatchToProps = {
  fetchToc,
  search,
};


export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
