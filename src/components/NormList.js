import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';

import { slugify } from 'helpers/utils';


export default class NormList extends React.Component {
  static propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.shape({
      norm: ImmutableTypes.mapContains({
        title: PropTypes.string.isRequired,
        enumeration: PropTypes.string.isRequired,
      }).isRequired,
      children: PropTypes.array,
    })).isRequired,
  };

  listNodes = ({ norm, children }, i) => (
    <li key={i}>
      <a href={'#'+slugify(norm.get('title'))}>{norm.get('title')}</a>
      {!children ? false : <ul>{children.map(this.listNodes)}</ul>}
    </li>
  );

  render() {
    const { nodes, ...otherProps} = this.props;
    return (
      <ul {...otherProps}>
        {nodes.map(this.listNodes)}
      </ul>
    );
  }
}
