import React, { PropTypes } from 'react';
import { Layout as MaterialLayout } from 'react-mdl';

import Header from './Header';
import Drawer from './Drawer';
import Content from './Content';
// import Footer from './Footer';
import './layout.scss';


class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    navigation: PropTypes.arrayOf(PropTypes.shape({
      to: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })),
    search: PropTypes.func.isRequired,
    title: PropTypes.string,
  };

  render() {
    const { title, children, navigation, search } = this.props;

    return (
      <MaterialLayout fixedDrawer>
        <Header title={title} links={navigation} search={search} />
        <Drawer title={title} primary={navigation} />
        <Content>{children}</Content>
        {/*<Footer primary={primaryNavigation} />*/}
      </MaterialLayout>
    );
  }
}


export default Layout;
