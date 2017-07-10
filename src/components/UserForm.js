import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutableTypes from 'react-immutable-proptypes';
import { Card, CardTitle, CardText, CardActions, Button } from 'react-mdl';

import LoginForm from './LoginForm';

export default class UserForm extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    shadow: PropTypes.number,
    user: ImmutableTypes.mapContains({
      email: PropTypes.string,
      loggedin: PropTypes.bool.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { actuallyDeleteUser: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  deleteUserMock() {
    if (!this.state.actuallyDeleteUser) {
      this.setState({ actuallyDeleteUser: true });
    } else {
      const { logout, user } = this.props;
      logout(user.get('email'), /* deleteUser: */ true);
    }
  }

  render() {
    const { user, login, logout, shadow, ...otherProps } = this.props;
    const { actuallyDeleteUser } = this.state;
    return user.get('loggedin')
      ? <Card
          shadow={shadow}
          {...otherProps}
          style={{ alignItems: 'stretch' }}
        >
          <CardTitle>
            {user.get('email')}
          </CardTitle>
          <CardText style={{ height: '50%' }}>&nbsp;</CardText>
          <CardActions>
            <Button
              ripple
              raised
              onClick={() => logout(user.get('email'))}
              style={{ float: 'right' }}
            >
              Logout
            </Button>
            <Button
              ripple={actuallyDeleteUser}
              raised={actuallyDeleteUser}
              accent={actuallyDeleteUser}
              onClick={() => this.deleteUserMock()}
              style={{ float: 'right', marginRight: '1em' }}
            >
              Konto auflösen {actuallyDeleteUser && 'bestätigen'}
            </Button>
          </CardActions>
        </Card>
      : <LoginForm
          onMouseEnter={() => this.hover(2)}
          onMouseLeave={() => this.hover(0)}
          user={user}
          login={login}
          shadow={shadow}
          {...otherProps}
        />;
  }
}
