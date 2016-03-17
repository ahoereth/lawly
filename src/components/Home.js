import React, { PropTypes } from 'react';
import {
  Grid, Cell,
  Card, CardTitle, CardText, CardActions,
  Textfield, Button
} from 'react-mdl';


class Home extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  submit(e) {
    e && e.preventDefault();
    const { email, password } = this.state;
    this.props.login(email, password);
  }

  signup(e) {
    e && e.preventDefault();
    const { email, password } = this.state;
    this.props.login(email, password, /*signup:*/ true);
  }

  input(e) {
    const elem = e.currentTarget;
    if (['email', 'password'].includes(elem.name)) {
      this.setState({ [elem.name]: elem.value });
    }
  }

  render() {
    const { email, password } = this.state;

    return (
      <Grid>
        <Cell col={4}>
          <form action='/~' method='POST' onSubmit={this.submit.bind(this)}>
            <Card shadow={1} style={{width: '100%'}}>
              <CardTitle>Login</CardTitle>
              <CardText>
                  <Textfield
                    floatingLabel
                    type='email'
                    name='email'
                    label='E-Mail'
                    style={{width: '100%'}}
                    value={email}
                    onChange={this.input.bind(this)}
                  />
                  <Textfield
                    floatingLabel
                    type='password'
                    name='password'
                    label='Passwort'
                    style={{width: '100%'}}
                    value={password}
                    onChange={this.input.bind(this)}
                  />
              </CardText>
              <CardActions>
                <Button ripple raised accent
                  style={{float: 'right'}}
                  type='submit'
                >
                  Einloggen
                </Button>
                  <Button ripple raised
                    style={{float: 'right', marginRight: '1em'}}
                    onClick={this.signup.bind(this)}
                  >
                    Registrierieren
                  </Button>
              </CardActions>
            </Card>
          </form>
        </Cell>
      </Grid>
    );
  }
}


export default Home;
