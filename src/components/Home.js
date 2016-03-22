import React, { PropTypes } from 'react';
import { Grid, Cell } from 'react-mdl';

import WelcomeMessage from './WelcomeMessage';
import LoginForm from './LoginForm';


const Home = ({ user, login, logout }) => (
  <Grid>
    <Cell col={4}>
      <WelcomeMessage {...{user, logout}} />
    </Cell>
    <Cell col={4}>
      {user.loggedin ? false : <LoginForm shadow={1} {...{user, login}} />}
    </Cell>
  </Grid>
);

Home.propTypes = {
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.shape({
    loggedin: PropTypes.bool.isRequired,
  }).isRequired,
};


export default Home;
