import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { IconToggle } from 'react-mdl';

import { slugify } from 'helpers/utils';
import Html from 'components/Html';
import styles from './norm.sss';


const Norm = ({ data, star, starred }) => {
  const { enumeration, groupkey, title, body, foot } = data.toObject();

  let heading = enumeration.split('.').length + 1;
  heading = enumeration === '0' ? 1 : (heading > 6 ? 6 : heading);

  let lead = null;
  if (star) {
    lead = (
      <div className={styles.lead}>
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
    <div className={styles.norm}>
      {lead}
      {React.createElement('h' + heading, {id: slugify(title)}, title)}
      <div><Html>{body}</Html></div>
      <div><Html>{foot}</Html></div>
    </div>
  );
};

Norm.propTypes = {
  data: ImmutablePropTypes.mapContains({
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
