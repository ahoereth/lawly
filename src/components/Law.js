import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
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
  norms: ImmutablePropTypes.list.isRequired,
  star: PropTypes.func.isRequired,
  starred: PropTypes.bool.isRequired,
};


export default Law;
