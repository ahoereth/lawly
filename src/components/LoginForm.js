import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutableTypes from 'react-immutable-proptypes';
import {
  Card, CardTitle, CardText, CardActions,
  Textfield, Button,
} from 'react-mdl';

import { omit } from 'helpers/utils';


class LoginForm extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    shadow: PropTypes.number,
    user: ImmutableTypes.mapContains({
      email: PropTypes.string,
      loggedin: PropTypes.bool.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    shadow: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: props.user.email || '',
      password: '',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  submit = (e) => {
    e && e.preventDefault();
    const { email, password } = this.state;
    this.props.login(email, password);
  }

  signup = (e) => {
    e && e.preventDefault();
    const { email, password } = this.state;
    this.props.login(email, password, /* signup: */ true);
  }

  input = (e) => {
    const { name, value } = e.currentTarget;
    if (name === 'email' || name === 'password') {
      this.setState({ [name]: value });
    }
  }

  render() {
    const { email, password } = this.state;
    const { shadow, ...otherProps } = this.props;

    return (
      <form onSubmit={this.submit}>
        <Card shadow={shadow} {...omit(otherProps, 'login', 'user')}>
          <CardTitle>Login</CardTitle>
          <CardText>
            <Textfield
              floatingLabel
              type='email'
              name='email'
              label='E-Mail'
              style={{ width: '100%' }}
              value={email}
              onChange={this.input}
            />
            <Textfield
              floatingLabel
              type='password'
              name='password'
              label='Passwort'
              style={{ width: '100%' }}
              value={password}
              onChange={this.input}
            />
          </CardText>
          <CardActions>
            <Button
              ripple raised accent
              style={{ float: 'right' }}
              type='submit'
            >
              Einloggen
            </Button>
            <Button
              ripple raised
              style={{ float: 'right', marginRight: '1em' }}
              onClick={this.signup}
            >
              Registrierieren
            </Button>
          </CardActions>
        </Card>
      </form>
    );
  }
}


export default LoginForm;
