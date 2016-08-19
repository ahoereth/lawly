import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ImmutableTypes from 'react-immutable-proptypes';

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

  listNodes = (node, i) => {
    const title = node.getIn(['norm', 'title']);
    const children = node.get('children', false);
    return (
      <li key={node.getIn(['norm', 'enumeration'], i)}>
        <a href={`#${slugify(title)}`}>{title}</a>
        {!children ? false : <ul>{children.map(this.listNodes)}</ul>}
      </li>
    );
  }

  render() {
    const { nodes, ...otherProps } = this.props;
    return (
      <ul {...otherProps}>
        {nodes.map(this.listNodes)}
      </ul>
    );
  }
}
