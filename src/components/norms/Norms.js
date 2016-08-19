import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';

import Norm from './Norm';


const Norms = ({ annotations, nodes, star }) => (
  <div>
    {nodes.map((node, i) =>
      <Norm
        key={node.getIn(['norm', 'enumeration'], i)}
        data={node.get('norm')}
        descendants={node.get('children')}
        annotations={annotations}
        star={star}
      />
    )}
  </div>
);

Norms.propTypes = {
  annotations: ImmutableTypes.mapOf(ImmutableTypes.map).isRequired,
  nodes: ImmutableTypes.listOf(ImmutableTypes.mapContains({
    norm: ImmutableTypes.map.isRequired,
    children: ImmutableTypes.list,
  })).isRequired,
  star: PropTypes.func.isRequired,
};


export default Norms;
