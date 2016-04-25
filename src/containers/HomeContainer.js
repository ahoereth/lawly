import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { fetchLawIndex, getLawIndex } from 'redux/modules/law_index';
import { login, logout, getUser } from 'redux/modules/user';
import { Home } from '../components';


class HomeContainer extends React.Component {
  static propTypes = {
    fetchLawIndex: PropTypes.func.isRequired,
    indexTitles: ImmutableTypes.mapOf(PropTypes.string),
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    user: ImmutableTypes.map,
  };

  componentWillMount() {
    const { fetchLawIndex, indexTitles } = this.props;
    indexTitles.isEmpty() && fetchLawIndex();
  }

  render() {
    return <Home {...this.props} />;
  }
}


export default connect(
  (state) => ({
    user: getUser(state),
    indexTitles: getLawIndex(state),
  }),
  { login, logout, fetchLawIndex }
)(HomeContainer);
