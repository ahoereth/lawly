import React, { PropTypes } from 'react';
import cn from 'classnames';
import { isUndefined } from 'lodash';
import {
  Layout as MaterialLayout,
  Content,
  Snackbar,
} from 'react-mdl';

import Header from './Header';
// import Drawer from './Drawer';
import Footer from './Footer';
import { background } from './layout.sss';


function reload() {
  if (!isUndefined(global.location)) {
    global.location.reload(true);
  }
}


const Layout = ({
  isOnline,
  title,
  children,
  outdated,
  pathname,
  navigation,
  search,
  query,
}) => (
  <MaterialLayout
    fixedHeader
    className={cn({ [background]: pathname === '/' })}
  >
    <Header
      isOnline={isOnline}
      links={navigation}
      pathname={pathname}
      query={query}
      search={search}
      title={title}
    />
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

// See github.com/yannickcr/eslint-plugin-react/issues/816
/* eslint-disable react/no-unused-prop-types */
Layout.propTypes = {
  children: PropTypes.node,
  isOnline: PropTypes.bool.isRequired,
  outdated: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
  navigation: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })),
  query: PropTypes.string,
  search: PropTypes.func.isRequired,
  title: PropTypes.string,
};


export default Layout;
