import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { login, logout, getUser } from 'redux/modules/user';
import { Home } from '../components';


class HomeContainer extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    user: ImmutableTypes.map,
  };

  render() {
    return <Home {...this.props} />;
  }
}


export default connect(
  (state) => ({
    user: getUser(state),
  }),
  { login, logout }
)(HomeContainer);
