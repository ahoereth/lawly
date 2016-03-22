import React, { PropTypes } from 'react';

import { slugify } from 'helpers/utils';
import Html from 'components/Html';
import './norm.scss';


const Norm = ({ data }) => {
  const { enumeration, groupkey, title, body, foot } = data;

  let heading = enumeration.split('.').length + 1;
  heading = enumeration === '0' ? 1 : (heading > 6 ? 6 : heading);

  const children = heading !== 1 ? title :
    [<small style={{display: 'block'}} key='key'>({groupkey})</small>, title];

  return (
    <div className='norm'>
      {React.createElement('h' + heading, {id: slugify(title), children})}
      <div><Html>{body}</Html></div>
      <div><Html>{foot}</Html></div>
    </div>
  );
};

Norm.propTypes = {
  data: PropTypes.shape({
    enumeration: PropTypes.string.isRequired,
    groupkey: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    foot: PropTypes.string.isRequired,
  }).isRequired,
};


export default Norm;
