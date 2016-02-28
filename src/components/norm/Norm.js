import React, { PropTypes } from 'react';

import NormText from './NormText';
import './norm.scss';


const Norm = ({ data }) => {
  if (data.kind === 'gliederung') {
    const { gliederungseinheit, enbez, text } = data;
    const { gliederungsbez, gliederungstitel } = gliederungseinheit;
    const titel = gliederungstitel ? ': ' + gliederungstitel : '';
    return (
      <div key={data.doknr} className='norm'>
        <h3>{enbez ? enbez : gliederungsbez + titel}</h3>
        <NormText>{text}</NormText>
      </div>
    );
  }

  if (data.kind === 'paragraph') {
    const { enbez, titel, text } = data;
    return (
      <div key={data.doknr} className='norm'>
        <h4>{enbez}{!titel ? false : `: ${titel}`}</h4>
        <NormText>{text}</NormText>
      </div>
    );
  }

  return <span />;
};

Norm.propTypes = {
  data: PropTypes.object,
};


export default Norm;
