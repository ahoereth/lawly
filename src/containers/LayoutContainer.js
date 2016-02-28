import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { search } from 'redux/modules/search';
import { Layout } from '../components';


const navigation = [
  {to: '/', text: 'Home'},
  {to: '/gesetze', text: 'Gesetz Index'}
];


class LayoutContainer extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    htmltitle: PropTypes.string.isRequired,
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
    const { children, search, title } = this.props;

    return (
      <Layout title={title} navigation={navigation} search={search}>
        {children}
      </Layout>
    );
  }
}


function mapStateToProps(state = {
  title: 'Lawly'
}, ownProps) {
  const { routes } = ownProps;
  const title = routes[routes.length - 1].title;

  return {
    title,
    htmltitle: title + ' | Lawly'
  };
}


const mapDispatchToProps = {
  search,
};


export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);
