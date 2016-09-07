import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { login, logout, getUser, getUserLaws } from '~/modules/user';
import { setTitle } from '~/modules/core';
import { Home } from '~/components';


class HomeContainer extends React.Component {
  static propTypes = {
    laws: ImmutableTypes.list,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    user: ImmutableTypes.map,
  };

  componentWillMount() {
    this.props.setTitle('Lawly');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return <Home {...this.props} />;
  }
}


export default connect(
  (state) => ({
    user: getUser(state),
    laws: getUserLaws(state),
  }),
  { login, logout, setTitle }
)(HomeContainer);
