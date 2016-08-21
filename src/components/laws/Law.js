import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell } from 'react-mdl';

import { NormList, Norms } from '~/components';


const Law = ({ annotations, loading, norms, star }) => (
  <Grid>
    <Cell col={8} className='law'>
      <Norms
        nodes={norms}
        annotations={annotations}
        star={star}
        loading={loading}
      />
    </Cell>
    <Cell col={4} className='law-sidebar'>
      <NormList nodes={norms} />
    </Cell>
  </Grid>
);

Law.propTypes = {
  annotations: ImmutableTypes.mapOf(ImmutableTypes.map).isRequired,
  loading: PropTypes.bool.isRequired,
  norms: ImmutableTypes.list.isRequired,
  star: PropTypes.func.isRequired,
};


export default Law;
