import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { search } from 'redux/modules/search';
import { Gesetze } from '../components';


class SearchContainer extends React.Component {
  static propTypes = {
    search: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    results: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired
  };

  componentWillMount() {
    const { search, params } = this.props;
    search(params.query);
  }

  render() {
    const { loading, results } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return <Gesetze gesetze={results.slice(1, 100)} />;
  }
}


function mapStateToProps(state) {
  const { error, loading, results } = state.search;
  return { error, loading, results };
}

const mapDispatchToProps = {
  search,
};


export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
