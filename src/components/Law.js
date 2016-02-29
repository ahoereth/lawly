import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'react-mdl';

import { Norm } from 'components';


const Law = ({ norms }) => (
  <Card shadow={0} className='gesetz'>
    <CardTitle>
      <h2 className='mdl-card__title-text'>{norms[0].langue}</h2>
      <div>{norms[0].groupkey}</div>
    </CardTitle>
    <CardText>
      {norms.map((norm, i) => <Norm key={i} data={norm} />)}
    </CardText>
  </Card>
);

Law.propTypes = {
  norms: PropTypes.array.isRequired,
};


export default Law;
