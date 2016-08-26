import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { List, Map } from 'immutable';

import Norm from './Norm';


const shell = List([
  Map({
    norm: Map(),
  }),
]);


const Norms = ({ annotations, deeplink, nodes, star, loading, ...props }) => (
  <div {...props}>
    {(!loading ? nodes : shell).map((node, i) =>
      <Norm
        key={node.getIn(['norm', 'enumeration'], i)}
        data={node.get('norm')}
        deeplink={deeplink}
        descendants={node.get('children')}
        annotations={annotations}
        star={star}
      />
    )}
  </div>
);

Norms.propTypes = {
  annotations: ImmutableTypes.mapOf(ImmutableTypes.map).isRequired,
  deeplink: PropTypes.string,
  loading: PropTypes.bool,
  nodes: ImmutableTypes.listOf(ImmutableTypes.mapContains({
    norm: ImmutableTypes.map.isRequired,
    children: ImmutableTypes.list,
  })).isRequired,
  star: PropTypes.func.isRequired,
};

Norms.defaultProps = {
  loading: false,
};


export default Norms;
