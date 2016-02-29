import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { single as fetchGesetz } from '../redux/modules/gesetze';
import { Gesetz } from '../components';


class GesetzContainer extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fetchGesetz: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      groupkey: PropTypes.string.isRequired
    }).isRequired,
  };

  componentWillMount() {
    const { fetchGesetz, params } = this.props;
    fetchGesetz(params.groupkey);
  }

  render() {
    const { loading, data } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return <Gesetz normen={data} />;
  }
}


function mapStateToProps({ gesetze }, { params }) {
  const { groups } = gesetze || { groups: {} };
  const data = groups[params.groupkey] || [];
  const loading = (data.length === 0);

  return {
    loading,
    data,
  };
}

const mapDispatchToProps = {
  fetchGesetz,
};


export default connect(mapStateToProps, mapDispatchToProps)(GesetzContainer);
