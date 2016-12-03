import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import { Grid, Cell, Card, CardTitle, CardText, CardActions, Button, IconButton } from 'react-mdl';

import screenshot from 'screenshots/urhg_horizontal.png';
import { getNormLink } from '~/helpers';
import { LoginForm } from '~/components';


const lead = [
  'Lawly ist eine neue Art Gesetzestexte zu durchsuchen, zu lesen und zu verwalten.',
  'Enim labore aliqua consequat ut quis ad occaecat aliquip incididunt. Sunt nulla eu enim irure enim nostrud aliqua consectetur ad consectetur sunt ullamco officia. Ex officia laborum et consequat duis.',
];

const urhg = [
  'Nach dem Verständnis vieler Menschenrechtler gehört der freie und umfängliche Zugriff auf Gesetzestexte zur Grundlage einer mündigen Teilhabe am öffentlichen Leben und ist eine Notwendigkeit für die aktive Mitgestaltung  eines demokratischen Landes. Obwohl dies sogar in europäischen Gesetzen niedergeschrieben ist kümmert sich die deutsche Regierung nur eingeschränkt um dieses Recht.',
];


const Landing = ({ user, login }) => (
  <Grid>
    <Cell col={6} offsetDesktop={1} tablet={6} offsetTablet={1} phone={8}>
      <Card shadow={1} style={{ height: '100%' }}>
        <CardTitle>Willkommen bei Lawly!</CardTitle>
        <CardText style={{ alignItems: 'stretch' }}>
          {lead.map((par, i) => <p key={i}>{par}</p>)}
        </CardText>
        <CardActions>
          <Button>Schreib uns was du denkst</Button>
        </CardActions>
      </Card>
    </Cell>
    <Cell col={4} tablet={6} offsetTablet={1} phone={8}>
      <LoginForm shadow={1} user={user} login={login} />
    </Cell>
    <Cell col={4} offsetDesktop={1} tablet={6} offsetTablet={1} phone={8}>
      <Card shadow={1} style={{ height: '100%' }}>
        <CardTitle>Urheberrechtsgesetz</CardTitle>
        <CardText>{urhg.map((par, i) => <p key={i}>{par}</p>)}</CardText>
      </Card>
    </Cell>
    <Cell col={6} tablet={6} offsetTablet={1} phone={8}>
      <Card
        shadow={1}
        style={{
          background: `url(${screenshot}) top / cover`,
          backgroundPositionX: '-30px',
        }}
      >
        <CardTitle expand />
        <CardActions
          style={{
            fontSize: '.9em',
            lineHeight: '2.3em',
            padding: '.5em 1em',
            background: 'rgba(0, 0, 0, 0.7)',
          }}
        >
          <span style={{ color: '#fff', fontWeight: '500' }}>
            Gesetzestexte sind in Deutschland nicht urheberrechtlich geschützt.
          </span>
          <Link
            to={getNormLink('UrhG', '1.2.4', '5-amtliche-werke')}
            style={{ color: 'inherit' }}
          >
            <IconButton
              ripple raised accent name='center_focus_strong'
              style={{ float: 'right' }}
            />
          </Link>
        </CardActions>
      </Card>
    </Cell>
  </Grid>
);

Landing.propTypes = {
  login: PropTypes.func.isRequired,
  user: ImmutableTypes.mapContains({
    email: PropTypes.string,
    loggedin: PropTypes.bool.isRequired,
  }).isRequired,
};


export default Landing;
