import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { setTitle } from '~/modules/core';
import { LegalNotice } from '~/components';

const mapDispatchToProps = {
  setTitle,
};

class LegalNoticeContainer extends React.Component {
  static propTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.setTitle('Impressum');
  }

  render() {
    return <LegalNotice />;
  }
}

export default connect(() => ({}), mapDispatchToProps)(LegalNoticeContainer);
