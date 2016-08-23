import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { connect } from 'react-redux';

import { search, getQuery } from '~/modules/search';
import { isUpdateAvailable } from '~/modules/core';
import { Layout } from '~/components';


const navigation = [
  { to: '/', text: 'Home' },
  { to: '/gesetze', text: 'Gesetz Index' },
  { to: '/suche', text: 'Suche' },
];


class LayoutContainer extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    htmltitle: PropTypes.string.isRequired,
    outdated: PropTypes.bool.isRequired,
    query: PropTypes.string,
    search: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  // constructor(props) {
  //   super(props);
  //   this.componentWillReceiveProps(props);
  // }

  // componentWillReceiveProps(nextProps) {
  //  /* global document */
  //  // TODO: Better approach for this.
  //  document.title = nextProps.htmltitle;
  // }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { children, outdated, query, search, title } = this.props;

    return (
      <Layout
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


function mapStateToProps(state, ownProps) {
  const { routes } = ownProps;
  const title = routes[routes.length - 1].title;

  return {
    title,
    outdated: isUpdateAvailable(state),
    query: getQuery(state),
    htmltitle: `${title} | Lawly`,
  };
}


const mapDispatchToProps = {
  search,
};


export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);
