import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';

const UserLaw = ({ groupkey, norms, title }) => {
  const childNorms = norms.has('0') ? norms.skip(1) : norms;
  return (
    <div>
      <Link to={`/gesetz/${groupkey}`}>{groupkey}</Link>:&nbsp;
      {title}
      <ul>
        {childNorms.entrySeq().map(([enumeration, norm]) =>
          <li key={enumeration}>
            <Link to={`gesetz/${groupkey}/${enumeration}`}>
              {norm.get('title')}
            </Link>
          </li>,
        )}
      </ul>
    </div>
  );
};

UserLaw.propTypes = {
  groupkey: PropTypes.string.isRequired,
  norms: ImmutableTypes.mapOf(
    ImmutableTypes.mapContains({
      title: PropTypes.string,
    }),
  ).isRequired,
  title: PropTypes.string,
};

export default UserLaw;
