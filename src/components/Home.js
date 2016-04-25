import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell } from 'react-mdl';

import WelcomeMessage from './WelcomeMessage';
import LoginForm from './LoginForm';
import UserLaws from './UserLaws';


const Home = ({ user, login, logout, indexTitles }) => (
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
        <UserLaws laws={user.get('laws')} indexTitles={indexTitles} />
      </Cell>
    }
  </Grid>
);

Home.propTypes = {
  indexTitles: ImmutableTypes.mapOf(PropTypes.string).isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  user: ImmutableTypes.mapContains({
    email: PropTypes.string,
    loggedin: PropTypes.bool.isRequired,
    laws: ImmutableTypes.map,
  }).isRequired,
};


export default Home;
