import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell } from 'react-mdl';

import LawList from 'components/LawList';
import LoginForm from 'components/LoginForm';
import WelcomeMessage from './WelcomeMessage';


const Home = ({ user, laws, login, logout }) => (
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
        <LawList laws={laws} />
      </Cell>
    }
  </Grid>
);

Home.propTypes = {
  laws: ImmutableTypes.list.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  user: ImmutableTypes.mapContains({
    email: PropTypes.string,
    loggedin: PropTypes.bool.isRequired,
  }).isRequired,
};


export default Home;
