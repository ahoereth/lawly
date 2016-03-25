import React, { PropTypes } from 'react';
import { IconToggle } from 'react-mdl';

import { slugify } from 'helpers/utils';
import Html from 'components/Html';
import './norm.sss';


const Norm = ({ data, star, starred }) => {
  const { enumeration, groupkey, title, body, foot } = data;

  let heading = enumeration.split('.').length + 1;
  heading = enumeration === '0' ? 1 : (heading > 6 ? 6 : heading);

  let head = null;
  if (star) {
    head = (
      <div className='law-lead'>
        <IconToggle ripple
          checked={starred}
          name={starred ? 'star' : 'star_border'}
          onChange={() => star(groupkey, !starred)}
        />
        <span>{groupkey}</span>
      </div>
    );
  }

  return (
    <div className='norm'>
      {head}
      {React.createElement('h' + heading, {id: slugify(title)}, title)}
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
  star: PropTypes.func,
  starred: PropTypes.bool,
};


export default Norm;
