import React, { PropTypes } from 'react';

import { slugify } from 'helpers/utils';
import './norm.scss';


const Norm = ({ data }) => {
  let heading = data.enumeration.split('.').length + 1;
  heading = data.enumeration === '0' ? 1 : (heading > 6 ? 6 : heading);
  heading = `h${heading}`;

  let children = [
    <span key='title' id={slugify(data.title)}>{data.title}</span>
  ];

  if (heading === 'h1') {
    children.unshift(
      <small style={{display: 'block'}} key='key'>({data.groupkey})</small>
    );
  }

  return (
    <div className='norm'>
      {React.createElement(heading, {children})}
      <div dangerouslySetInnerHTML={{__html: data.body}} />
      <div dangerouslySetInnerHTML={{__html: data.foot}} />
    </div>
  );
};

Norm.propTypes = {
  data: PropTypes.object,
};


export default Norm;
