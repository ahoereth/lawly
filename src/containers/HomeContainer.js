import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { login } from 'redux/modules/user';
import { Home } from '../components';


class HomeContainer extends React.Component {
  static propTypes = {
    email: PropTypes.string,
    jwt: PropTypes.string,
    login: PropTypes.func.isRequired,
  };

  render() {
    return <Home {...this.props} />;
  }
}


export default connect(
  ({ user }) => ({ email: user.email }),
  { login }
)(HomeContainer);
