import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'react-mdl';

import { Norm } from 'components';
import './gesetz.scss';


const Gesetz = ({ normen }) => {
  const lead = normen[0];

  return (
    <Card shadow={0} className='gesetz'>
      <CardTitle>
        <h2 className='mdl-card__title-text'>{lead.langue}</h2>
        <div>{lead.groupkey}</div>
      </CardTitle>
      <CardText>
        {normen.map((norm, i) => <Norm key={i} data={norm} />)}
      </CardText>
    </Card>
  );
};

Gesetz.propTypes = {
  normen: PropTypes.array.isRequired,
};


export default Gesetz;
