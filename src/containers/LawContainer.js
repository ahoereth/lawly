import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchLaw } from 'redux/modules/laws';
import { Law } from 'components';


class GesetzContainer extends React.Component {
  static propTypes = {
    fetchLaw: PropTypes.func.isRequired,
    norms: PropTypes.array,
    params: PropTypes.shape({
      groupkey: PropTypes.string.isRequired
    }).isRequired,
  };

  componentWillMount() {
    const { fetchLaw, params, norms } = this.props;
    norms || fetchLaw(params.groupkey);
  }

  render() {
    const { norms } = this.props;

    if (!norms || norms.length === 0) {
      return <div>Loading...</div>;
    }

    return <Law norms={norms} />;
  }
}


function mapStateToProps({ laws }, { params }) {
  const { groups } = laws || { groups: {} };

  return {
    norms: groups[params.groupkey],
  };
}

const mapDispatchToProps = { fetchLaw };


export default connect(mapStateToProps, mapDispatchToProps)(GesetzContainer);
