import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { List } from 'immutable';
import { range } from 'lodash';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell, Button } from 'react-mdl';

import { getIndexLink as to } from '~/helpers';
import styles from './lawInitialChooser.sss';

const shell = List(range(20).map(() => ''));

const LawInitialChooser = ({ collection = '', initials, selected }) =>
  <Grid>
    {(initials.size ? initials : shell).map((initial, idx) =>
      <Cell
        key={initial || `shell-${idx}`}
        col={12}
        tablet={8}
        phone={1}
        className={styles.cell}
      >
        {initial === ''
          ? <Button raised disabled />
          : <Link
              to={to({
                collection,
                initial: selected !== initial.toLowerCase() ? initial : '',
              })}
            >
              <Button
                ripple
                raised
                accent={selected === initial.toLowerCase()}
              >
                {initial}
              </Button>
            </Link>}
      </Cell>,
    )}
  </Grid>;

LawInitialChooser.propTypes = {
  collection: PropTypes.string,
  initials: ImmutableTypes.listOf(PropTypes.string).isRequired,
  selected: PropTypes.string,
};

export default LawInitialChooser;
