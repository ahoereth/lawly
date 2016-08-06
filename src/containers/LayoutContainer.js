import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { search, getQuery } from 'modules/search';
import { Layout } from 'components';


const navigation = [
  {to: '/', text: 'Home'},
  {to: '/gesetze', text: 'Gesetz Index'},
  {to: '/suche', text: 'Suche' },
];


class LayoutContainer extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    htmltitle: PropTypes.string.isRequired,
    query: PropTypes.string,
    search: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.componentWillReceiveProps(props);
  }

  componentWillReceiveProps(nextProps) {
    /* global document */
    document.title = nextProps.htmltitle;
  }

  render() {
    const { children, query, search, title } = this.props;

    return (
      <Layout
        title={title}
        navigation={navigation}
        search={search}
        query={query}
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
    query: getQuery(state),
    title,
    htmltitle: title + ' | Lawly'
  };
}


const mapDispatchToProps = {
  search,
};


export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);
