import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell } from 'react-mdl';

import WelcomeMessage from './WelcomeMessage';
import LoginForm from './LoginForm';
import LawList from './LawList';


const Home = ({ user, login, logout }) => (
  <Grid>
    <Cell col={4}>
      <WelcomeMessage {...{user, logout}} />
    </Cell>
    {user.get('loggedin') ? null :
      <Cell col={4}>
        <LoginForm shadow={1} {...{user, login}} />
      </Cell>
    }
    {!user.get('loggedin') ? null :
      <Cell col={8}>
        <LawList laws={user.get('laws')} />
      </Cell>
    }
  </Grid>
);

Home.propTypes = {
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  user: ImmutableTypes.mapContains({
    email: PropTypes.string,
    loggedin: PropTypes.bool.isRequired,
    laws: ImmutableTypes.list,
  }).isRequired,
};


export default Home;
