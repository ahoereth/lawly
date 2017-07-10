import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { List } from 'immutable';
import { range } from 'lodash';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell, Button } from 'react-mdl';

import { getIndexLink as to } from '~/helpers';

const shell = List(range(4).map(() => ''));

const LawCollectionChooser = ({ collections, selected }) =>
  <Grid style={{ paddingTop: 0, paddingBottom: 0 }}>
    {(collections.size ? collections : shell).map((title, idx) =>
      <Cell key={title || `shell-${idx}`} col={3} tablet={4} phone={4}>
        {title === ''
          ? <Button raised disabled />
          : <Link to={to({ collection: selected !== title ? title : '' })}>
              <Button
                ripple
                raised
                accent={selected === title}
                style={{ width: '100%' }}
              >
                {title}
              </Button>
            </Link>}
      </Cell>,
    )}
  </Grid>;

LawCollectionChooser.propTypes = {
  collections: ImmutableTypes.listOf(PropTypes.string).isRequired,
  selected: PropTypes.string,
};

export default LawCollectionChooser;
