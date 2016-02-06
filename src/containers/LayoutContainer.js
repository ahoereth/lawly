import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Layout } from '../components';


const navigation = [
  {to: '/', text: 'Home'},
  {to: '/gesetze', text: 'Gesetz Index'}
];


class LayoutContainer extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    htmltitle: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
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
    const { title, children } = this.props;

    return (
      <Layout title={title} navigation={navigation}>{children}</Layout>
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


export default connect(mapStateToProps)(LayoutContainer);
