import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { isUndefined } from 'lodash';
import {
  Layout as MaterialLayout,
  Content,
  Snackbar,
} from 'react-mdl';

import Header from './Header';
import Drawer from './Drawer';
import Footer from './Footer';
import { wrapper, content, push, background } from './layout.sss';


function reload() {
  if (!isUndefined(global.location)) {
    global.location.reload(true);
  }
}


export default class Layout extends React.Component {
  // See github.com/yannickcr/eslint-plugin-react/issues/816
  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    children: PropTypes.node,
    isOnline: PropTypes.bool.isRequired,
    outdated: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
    navigation: PropTypes.shape({
      primary: PropTypes.arrayOf(PropTypes.shape({
        to: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      })),
      secondary: PropTypes.arrayOf(PropTypes.shape({
        to: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      })),
    }),
    query: PropTypes.string,
    search: PropTypes.func.isRequired,
    title: PropTypes.string,
  };

  componentWillReceiveProps() {
    // Hack for hiding the drawer on navigation change.
    // See https://github.com/react-mdl/react-mdl/issues/254
    // eslint-disable-next-line react/no-find-dom-node
    const layout = ReactDOM.findDOMNode(this.ref).MaterialLayout;
    // eslint-disable-next-line no-underscore-dangle
    if (layout.drawer_.classList.contains('is-visible')) {
      layout.toggleDrawer();
    }
  }

  toggleDrawer() {
    // eslint-disable-next-line react/no-find-dom-node, no-underscore-dangle
    ReactDOM.findDOMNode(this.ref).MaterialLayout.toggleDrawer();
  }

  render() {
    const {
      isOnline,
      title,
      children,
      outdated,
      pathname,
      navigation,
      search,
      query,
    } = this.props;
    return (
      <MaterialLayout
        fixedHeader
        className={cn({ [background]: pathname === '/' })}
        ref={(layoutref) => { this.ref = layoutref; }}
      >
        <Header
          isOnline={isOnline}
          links={navigation.primary}
          pathname={pathname}
          query={query}
          search={search}
          title={title}
          toggleDrawer={() => this.toggleDrawer()}
        />
        <Drawer title='Lawly' navigation={navigation} />
        <Content className={wrapper}>
          <div className={content}>
            {children}
            <div className={push} />
          </div>
          <Footer navigation={navigation} />
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
  }
}
