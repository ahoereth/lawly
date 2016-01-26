import React, { PropTypes } from 'react';

import { Layout } from '../components';


class LayoutContainer extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    const { children } = this.props;

    return (
      <Layout title='Lawly'>{children}</Layout>
    );
  }
}


export default LayoutContainer;
