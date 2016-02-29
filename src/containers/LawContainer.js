import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchLaw } from 'redux/modules/laws';
import { Law } from 'components';


class GesetzContainer extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fetchLaw: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      groupkey: PropTypes.string.isRequired
    }).isRequired,
  };

  componentWillMount() {
    const { fetchLaw, params } = this.props;
    fetchLaw(params.groupkey);
  }

  render() {
    const { loading, data } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return <Law norms={data} />;
  }
}


function mapStateToProps({ laws }, { params }) {
  const { groups } = laws || { groups: {} };
  const data = groups[params.groupkey] || [];
  const loading = (data.length === 0);

  return {
    loading,
    data,
  };
}

const mapDispatchToProps = { fetchLaw };


export default connect(mapStateToProps, mapDispatchToProps)(GesetzContainer);
