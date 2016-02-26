import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { toc as fetchGesetzeToc } from '../redux/modules/gesetze';
import { Gesetze } from '../components';


class GesetzeContainer extends React.Component {
  static propTypes = {
    fetchGesetzeToc: PropTypes.func.isRequired,
    initials: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    toc: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
    props.fetchGesetzeToc();
  }

  render() {
    const { loading, toc } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <Gesetze
        onChoice={this.choice}
        gesetze={toc}
      />
    );
  }

  choice(gesetz, idx) {
    console.log(idx, gesetz);
  }
}


function mapStateToProps(state) {
  const { loading, error, toc, initials } = state.gesetze || {
    loading: false,
    error: false,
    toc: [],
    initials: ('ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789').split('')
  };

  return {
    loading,
    error,
    toc,
    initials
  };
}

const mapDispatchToProps = {
  fetchGesetzeToc
};


export default connect(mapStateToProps, mapDispatchToProps)(GesetzeContainer);
