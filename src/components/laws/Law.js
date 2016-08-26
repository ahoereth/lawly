import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell } from 'react-mdl';

import { NormList, Norms } from '~/components';


const Law = ({ annotations, deeplink, loading, norms, star }) => (
  <Grid>
    <Cell col={8} className='law'>
      <Norms
        annotations={annotations}
        deeplink={deeplink}
        loading={loading}
        nodes={norms}
        star={star}
      />
    </Cell>
    <Cell col={4} className='law-sidebar'>
      <NormList nodes={norms} />
    </Cell>
  </Grid>
);

Law.propTypes = {
  annotations: ImmutableTypes.mapOf(ImmutableTypes.map).isRequired,
  deeplink: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  norms: ImmutableTypes.list.isRequired,
  star: PropTypes.func.isRequired,
};


export default Law;
