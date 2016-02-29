import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchToc } from '../redux/modules/gesetze';
import { Gesetze } from '../components';


class GesetzeContainer extends React.Component {
  static propTypes = {
    fetchToc: PropTypes.func.isRequired,
    initials: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    toc: PropTypes.array.isRequired
  };

  componentWillMount() {
    this.props.fetchToc();
  }

  render() {
    const { loading, toc } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return <Gesetze gesetze={toc.slice(1, 100)} />;
  }
}


function mapStateToProps(state) {
  const { loading, error, toc, initials } = state.gesetze || {
    loading: 0,
    error: false,
    toc: [],
    initials: ('ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789').split('')
  };

  return {
    loading: !!loading,
    error,
    toc,
    initials
  };
}

const mapDispatchToProps = {
  fetchToc,
};


export default connect(mapStateToProps, mapDispatchToProps)(GesetzeContainer);
