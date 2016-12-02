import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell } from 'react-mdl';

import { LawList } from '~/components';
import WelcomeMessage from './WelcomeMessage';
import Landing from './Landing';

const Home = ({ user, laws, login, logout }) => (
  user.get('loggedin') ? (
    <Grid>
      <Cell col={4}>
        <WelcomeMessage user={user} logout={logout} />
      </Cell>
      <Cell col={8}>
        <LawList
          laws={laws}
          emptysetMessage='Hier werden deine gespeicherten Gesetze erscheinen.'
        />
      </Cell>
    </Grid>
  ) : (
    <Landing login={login} user={user} />
  )
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
