import React, { PropTypes } from 'react';
import { Grid, Cell } from 'react-mdl';

import WelcomeMessage from './WelcomeMessage';
import LoginForm from './LoginForm';


class Home extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    user: PropTypes.object,
  };

  render() {
    const { user, login, logout } = this.props;

    console.log(user);

    return (
      <Grid>
        <Cell col={4}>
          <WelcomeMessage logout={logout.bind(null, user.email)} />
        </Cell>
        <Cell col={4}>
          {user.loggedin ? false : <LoginForm shadow={1} login={login} />}
        </Cell>
      </Grid>
    );
  }
}


export default Home;
