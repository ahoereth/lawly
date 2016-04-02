import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Grid, Cell } from 'react-mdl';

import { Norm, NormList } from 'components';


const Law = ({ annotations, norms, star }) => (
  <Grid>
    <Cell col={8} className='law'>
      {norms.map(norm => (
        <Norm
          key={norm.get('enumeration')}
          data={norm}
          star={star}
          annotations={annotations.get(norm.get('enumeration'))}
        />
      ))}
    </Cell>
    <Cell col={4} className='law-sidebar'>
      <NormList norms={norms} />
    </Cell>
  </Grid>
);

Law.propTypes = {
  annotations: ImmutablePropTypes.mapOf(ImmutablePropTypes.map).isRequired,
  norms: ImmutablePropTypes.list.isRequired,
  star: PropTypes.func.isRequired,
};


export default Law;
