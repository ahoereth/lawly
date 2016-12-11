import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { connect } from 'react-redux';

import { search, getQuery } from '~/modules/search';
import { getTitle, isUpdateAvailable, isOnline, getPathname } from '~/modules/core';
import { Layout } from '~/components';


const navigation = {
  primary: [
    { to: '/', text: 'Heimatseite' },
    { to: '/gesetze', text: 'Gesetzesübersicht' },
  ],
  secondary: [
    { to: '/impressum', text: 'Impressum' },
  ],
};


const mapStateToProps = state => ({
  isOnline: isOnline(state),
  title: getTitle(state),
  outdated: isUpdateAvailable(state),
  query: getQuery(state),
  pathname: getPathname(state),
});


const mapDispatchToProps = {
  search,
};


class LayoutContainer extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isOnline: PropTypes.bool.isRequired,
    outdated: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
    query: PropTypes.string,
    search: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {
      children, isOnline, outdated, query, search, title, pathname,
    } = this.props;

    return (
      <Layout
        isOnline={isOnline}
        outdated={outdated}
        pathname={pathname}
        query={query}
        search={search}
        title={title}
        navigation={navigation}
      >
        {children}
      </Layout>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);
