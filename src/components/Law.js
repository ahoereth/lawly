import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Grid, Cell } from 'react-mdl';

import { Norm, NormList } from 'components';


const Law = ({ norms, star, starred }) => (
  <Grid>
    <Cell col={8} className='law'>
      {<Norm key={-1} data={norms.first()} star={star} starred={starred} />}
      {norms.slice(1).map((norm, i) => <Norm key={i} data={norm} />)}
    </Cell>
    <Cell col={4} className='law-sidebar'>
      <NormList norms={norms} />
    </Cell>
  </Grid>
);

Law.propTypes = {
  norms: PropTypes.instanceOf(Immutable.List).isRequired,
  star: PropTypes.func.isRequired,
  starred: PropTypes.bool.isRequired,
};


export default Law;
