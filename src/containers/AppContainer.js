import React, { PropTypes } from 'react';


class AppContainer extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    const { children } = this.props;

    return (
      <div>{children}</div>
    );
  }
}


export default AppContainer;
