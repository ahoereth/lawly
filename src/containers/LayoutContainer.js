import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { connect } from 'react-redux';

import { search, getQuery } from '~/modules/search';
import { getTitle, isUpdateAvailable, isOnline } from '~/modules/core';
import { Layout } from '~/components';


const navigation = [
  { to: '/', text: 'Home' },
  { to: '/gesetze', text: 'Gesetz Index' },
  { to: '/suche', text: 'Suche' },
];


const mapStateToProps = state => ({
  isOnline: isOnline(state),
  title: getTitle(state),
  outdated: isUpdateAvailable(state),
  query: getQuery(state),
});


const mapDispatchToProps = {
  search,
};


class LayoutContainer extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isOnline: PropTypes.bool.isRequired,
    outdated: PropTypes.bool.isRequired,
    query: PropTypes.string,
    search: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { children, isOnline, outdated, query, search, title } = this.props;

    return (
      <Layout
        isOnline={isOnline}
        title={title}
        navigation={navigation}
        search={search}
        query={query}
        outdated={outdated}
      >
        {children}
      </Layout>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);
