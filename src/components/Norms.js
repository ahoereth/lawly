import React, { PropTypes } from 'react';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import { Norm } from 'components';


const Norms = ({ nodes }) => (
  <div>
    {nodes.map(({ norm, children }, i) =>
      <Norm key={i} data={norm} descendants={children} />
    )}
  </div>
);


Norms.propTypes = {
  // annotations: ImmutablePropTypes.mapOf(ImmutablePropTypes.map).isRequired,
  nodes: PropTypes.array.isRequired,
  // star: PropTypes.func.isRequired,
};


export default Norms;
