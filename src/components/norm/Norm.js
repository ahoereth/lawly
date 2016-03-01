import React, { PropTypes } from 'react';

import NormText from './NormText';
import './norm.scss';


const Norm = ({ data }) => {
  let output = [];

  if (data.langue) {
    output.push(<h1 key='langue'>{data.langue} <small>({data.groupkey})</small></h1>);
  }

  if (data.gliederungseinheit) {
    const { gliederungseinheit, enbez } = data;
    const { gliederungsbez: bez, gliederungstitel: titel } = gliederungseinheit;
    output.push(
      <h2 key='gliederung'>
        {enbez ? enbez : bez + (titel ? ': ' + titel : '')}
      </h2>
    );
  }

  if (data.enbez) {
    output.push(<h3 key='enbez'>{data.enbez}</h3>);
  }

  if (data.text) {
    output.push(<NormText key='text'>{data.text}</NormText>);
  }

  if (data.fussnoten) {
    output.push(<NormText footnote key='fussnoten'>{data.fussnoten}</NormText>);
  }

  return <div className='norm'>{output}</div>;
};

Norm.propTypes = {
  data: PropTypes.object,
};


export default Norm;
