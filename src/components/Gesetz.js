import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'react-mdl';

import Norm from './Norm';
import './gesetz.scss';


const Gesetz = ({ normen }) => {
  const lead = normen[0];

  return (
    <div>
      <Card shadow={0} style={{width: '780px', margin: '1em auto'}}>
        <CardTitle>
          <h2 className='mdl-card__title-text'>{lead.langue}</h2>
          <div>{lead.groupkey}</div>
        </CardTitle>
        <CardText>
          {normen.map((norm, i) => <Norm key={i} data={norm} />)}
        </CardText>
      </Card>
    </div>
  );
};

Gesetz.propTypes = {
  normen: PropTypes.array.isRequired,
};


export default Gesetz;
