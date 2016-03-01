import React, { PropTypes } from 'react';
import { Grid, Cell } from 'react-mdl';

import { Norm, NormList } from 'components';


const Law = ({ norms }) => (
  <Grid>
    <Cell col={8} className='law'>
      {norms.map((norm, i) => <Norm key={i} data={norm} />)}
    </Cell>
    <Cell col={4} className='law-sidebar'>
      <NormList norms={norms} />
    </Cell>
  </Grid>
);

Law.propTypes = {
  norms: PropTypes.array.isRequired,
};


export default Law;
