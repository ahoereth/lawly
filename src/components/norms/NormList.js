import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutableTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';

import { getNormLink } from '~/helpers';


export default class NormList extends React.Component {
  static propTypes = {
    nodes: ImmutableTypes.listOf(ImmutableTypes.mapContains({
      norm: ImmutableTypes.mapContains({
        title: PropTypes.string.isRequired,
      }).isRequired,
      children: ImmutableTypes.list,
    })).isRequired,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  listNode = (node, i) => {
    const children = node.get('children', false);
    const norm = node.get('norm');
    const title = norm.get('title');
    const groupkey = norm.get('groupkey');
    const enumeration = norm.get('enumeration');
    return (
      <li key={enumeration || i}>
        <Link to={getNormLink(groupkey, enumeration, title)}>{title}</Link>
        {!children ? false : <NormList nodes={children} />}
      </li>
    );
  }

  render() {
    const { nodes, ...otherProps } = this.props;
    return (
      <ul {...otherProps}>
        {nodes.map(this.listNode)}
      </ul>
    );
  }
}
