import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import { Grid, Cell, Card, CardTitle, CardText, CardActions, Button, IconButton } from 'react-mdl';

import screenshot from 'screenshots/urhg_horizontal.png';
import { getNormLink } from '~/helpers';
import { UserForm } from '~/components';
import { imageCard } from './common.sss';


const lead = [
  'Lawly ist eine neue Art Gesetzestexte zu durchsuchen, zu lesen und zu verwalten.',
  'Wir verfolgen das Ziel, freie Informationen breit zugänglich zu machen. Lawly wird regelmäßig mit den neuesten Gesetzestexten ergänzt und bietet dir die Möglichkeit auf diese Geräteübergreifend zuzugreifen. Mithilfe eines Kontos können Gesetze gesammelt werden und diese dann auch ohne bestehende Internetverbindung abgerufen werden.',
];

const urhg = [
  'Nach dem Verständnis vieler Menschenrechtler gehört der freie und umfängliche Zugriff auf Gesetzestexte zur Grundlage einer mündigen Teilhabe am öffentlichen Leben und ist eine Notwendigkeit für die aktive Mitgestaltung  eines demokratischen Landes. In Deutschland sind Gesetzestexte und Rechtssprechungen urheberrechtsfrei, allerdings nicht immer angemessen Verfügbar.',
];


export default class Landing extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    user: ImmutableTypes.mapContains({
      email: PropTypes.string,
      loggedin: PropTypes.bool.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { hover: 0 };
  }

  hover(idx) {
    this.setState({ hover: idx });
  }

  render() {
    const { user, login, logout } = this.props;
    const { hover } = this.state;
    return (
      <Grid>
        <Cell col={6} offsetDesktop={1} tablet={6} offsetTablet={1} phone={6}>
          <Card
            shadow={hover === 1 ? 4 : 0}
            onMouseEnter={() => this.hover(1)}
            onMouseLeave={() => this.hover(0)}
          >
            <CardTitle>Willkommen bei Lawly!</CardTitle>
            <CardText>
              {lead.map((par, i) => <p key={i}>{par}</p>)}
            </CardText>
            <CardActions>
              <Button>Schreib uns was du denkst</Button>
            </CardActions>
          </Card>
        </Cell>
        <Cell col={4} tablet={6} offsetTablet={1} phone={6}>
          <UserForm
            shadow={hover === 2 ? 4 : 0}
            onMouseEnter={() => this.hover(2)}
            onMouseLeave={() => this.hover(0)}
            user={user}
            login={login}
            logout={logout}
          />
        </Cell>
        <Cell col={4} offsetDesktop={1} tablet={6} offsetTablet={1} phone={6}>
          <Card
            shadow={hover === 3 ? 4 : 0}
            onMouseEnter={() => this.hover(3)}
            onMouseLeave={() => this.hover(0)}
          >
            <CardTitle>Urheberrechtsgesetz</CardTitle>
            <CardText>{urhg.map((par, i) => <p key={i}>{par}</p>)}</CardText>
          </Card>
        </Cell>
        <Cell col={6} tablet={6} offsetTablet={1} phone={6}>
          <Card
            shadow={hover === 4 ? 4 : 0}
            onMouseEnter={() => this.hover(4)}
            onMouseLeave={() => this.hover(0)}
            className={imageCard}
            style={{
              backgroundImage: `url('${screenshot}')`,
              backgroundPositionY: 'top',
              backgroundPositionX: '-30px',
            }}
          >
            <CardTitle expand />
            <CardText>
              Gesetze sind in Deutschland urheberrechtsfrei.
              <Link to={getNormLink('UrhG', '1.2.4', '5-amtliche-werke')}>
                <IconButton
                  ripple raised accent name='center_focus_strong'
                  style={{ float: 'right' }}
                />
              </Link>
            </CardText>
          </Card>
        </Cell>
      </Grid>
    );
  }
}
