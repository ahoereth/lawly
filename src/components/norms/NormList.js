import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutableTypes from 'react-immutable-proptypes';
import { Card } from 'react-mdl';
import { Link } from 'react-router';

import { slugify } from '~/helpers/utils';


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
    const norm = node.get('norm');
    const children = node.get('children', false);
    const title = norm.get('title');
    const groupkey = encodeURIComponent(norm.get('groupkey'));
    const enumeration = norm.get('enumeration');
    const slug = enumeration !== '0' ? `#${slugify(title)}` : '';

    return (
      <li key={enumeration || i}>
        <Link to={`/gesetz/${groupkey}/${enumeration}${slug}`}>
          {title}
        </Link>
        {!children ? false : <ul>{children.map(this.listNode)}</ul>}
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
