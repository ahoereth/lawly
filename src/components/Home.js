import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell, Card } from 'react-mdl';

import { LawList } from '~/components';
import Landing from './Landing';

const Home = ({ user, laws, login, logout }) => (
  <div>
    {user.get('loggedin') && (
      <Grid>
        <Cell col={10} offsetDesktop={1} tablet={8} offsetTablet={1} phone={8}>
          <Card shadow={1}>
            <LawList
              laws={laws}
              emptysetMessage='Hier werden deine gespeicherten Gesetze erscheinen.'
            />
          </Card>
        </Cell>
      </Grid>
    )}
    <Landing login={login} logout={logout} user={user} />
  </div>
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
