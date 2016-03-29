import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { login, logout, getUser } from 'redux/modules/user';
import { Home } from '../components';


class HomeContainer extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    user: PropTypes.object,
  };

  render() {
    return <Home {...this.props} />;
  }
}


export default connect(
  (state) => ({ user: getUser(state) }),
  { login, logout }
)(HomeContainer);
