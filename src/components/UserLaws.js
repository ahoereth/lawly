import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import {
  Card, CardTitle, CardText
} from 'react-mdl';

import UserLaw from './UserLaw';


const UserLaws = ({ laws, indexTitles }) => (
  <Card shadow={0}>
    <CardTitle>Merkzettel</CardTitle>
    <CardText>
      {laws.entrySeq().map(([groupkey, norms]) => (
        <UserLaw
          key={groupkey}
          groupkey={groupkey}
          norms={norms}
          title={indexTitles.get(groupkey)}
        />
      ))}
    </CardText>
  </Card>
);

UserLaws.propTypes = {
  indexTitles: ImmutableTypes.mapOf(PropTypes.string).isRequired,
  laws: ImmutableTypes.mapOf(ImmutableTypes.mapContains({
    title: PropTypes.string,
  })).isRequired,
};


export default UserLaws;
