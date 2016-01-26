import React, { PropTypes } from 'react';
import { Layout as MaterialLayout } from 'react-mdl';

import Header from './Header';
import Drawer from './Drawer';
import Content from './Content';
// import Footer from './Footer';


const primaryNavigation = [
  {style: 'internal', to: '/', text: 'home'}
];


class Layout extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const { title, children } = this.props;

    return (
      <MaterialLayout fixedDrawer>
        <Header title={title} links={primaryNavigation}/>
        <Drawer title={title} primary={primaryNavigation} />
        <Content>{children}</Content>
        {/*<Footer primary={primaryNavigation} />*/}
      </MaterialLayout>
    );
  }
}


export default Layout;
