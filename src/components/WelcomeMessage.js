import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import {
  Card, CardTitle, CardText, CardActions,
  /*Textfield,*/ Button
} from 'react-mdl';


const WelcomeMessage = ({ shadow, logout, user, ...otherProps }) => (
  <Card shadow={shadow} {...otherProps}>
    <CardTitle>Willkommen bei Lawly!</CardTitle>
    <CardText>
      <p>Das hier ist deine persönliche Startseite, hier findest du deine gespeicherten Gesetze und Normen, persönlichen Markierungen, einen kurzen Verlauf deiner letzten Aktionen in der App und Neuigkeiten von deinem Team.</p>

      <p>Wir sind noch eine junge Plattform und freuen uns immer über Feedback -- positiv sowie negativ. Antworten gibts innerhalb von 24 Stunden und kleine Verbesserungen können wir oft genauso schnell umsetzen.</p>
    </CardText>
    <CardActions>
      <Button>Schreib uns was du denkst</Button>
      {!user.get('loggedin') ? null :
        <Button
          ripple raised
          onClick={() => logout(user.get('email'))}
          style={{float: 'right'}}
        >
          Logout
        </Button>
      }
    </CardActions>
  </Card>
);

WelcomeMessage.propTypes = {
  logout: PropTypes.func.isRequired,
  shadow: PropTypes.number,
  user: ImmutableTypes.mapContains({
    email: PropTypes.string,
    loggedin: PropTypes.bool.isRequired,
  }).isRequired,
};

WelcomeMessage.defaultProps = {
  shadow: 0,
};


export default WelcomeMessage;
