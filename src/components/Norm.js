import React, { PropTypes } from 'react';


const Norm = ({ data }) => {
  if (data.kind === 'gliederung') {
    const { gliederungseinheit, enbez, text } = data;
    const { gliederungsbez, gliederungstitel } = gliederungseinheit;
    const titel = gliederungstitel ? ': ' + gliederungstitel : '';
    return (
      <div key={data.doknr}>
        <h3>{enbez ? enbez : gliederungsbez + titel}</h3>
        <div
          className='doctext'
          dangerouslySetInnerHTML={{__html: text}}
        />
      </div>
    );
  }

  if (data.kind === 'paragraph') {
    const { enbez, titel, text } = data;
    return (
      <div key={data.doknr}>
        <h4>{enbez}: {titel}</h4>
        <div
          className='doctext'
          dangerouslySetInnerHTML={{__html: text}}
        />
      </div>
    );
  }

  return <span />;
};

Norm.propTypes = {
  data: PropTypes.object,
};


export default Norm;
