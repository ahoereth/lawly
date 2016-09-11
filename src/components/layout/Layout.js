import React, { PropTypes } from 'react';
import { isUndefined } from 'lodash';
import {
  Layout as MaterialLayout,
  Content,
  Snackbar,
} from 'react-mdl';

import Header from './Header';
// import Drawer from './Drawer';
import Footer from './Footer';
import './layout.sss';


function reload() {
  if (!isUndefined(global.location)) {
    global.location.reload(true);
  }
}


const Layout = ({ title, children, outdated, navigation, search, query }) => (
  <MaterialLayout fixedHeader>
    <Header title={title} links={navigation} search={search} query={query} />
    {/* <Drawer title={title} primary={navigation} /> */}
    <Content>
      {children}
      <Footer primary={navigation} />
    </Content>
    <Snackbar
      active={outdated}
      onClick={reload}
      onTimeout={() => {}}
      timeout={15000}
      action='Jetzt laden'
    >
      Aktualisierung verfügbar
    </Snackbar>
  </MaterialLayout>
);

Layout.propTypes = {
  children: PropTypes.node,
  outdated: PropTypes.bool.isRequired,
  navigation: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })),
  query: PropTypes.string,
  search: PropTypes.func.isRequired,
  title: PropTypes.string,
};


export default Layout;
