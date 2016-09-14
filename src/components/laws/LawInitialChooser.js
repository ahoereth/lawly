import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { List } from 'immutable';
import { range } from 'lodash';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell, Button } from 'react-mdl';

import { getIndexLink as to } from '~/helpers';
import styles from './lawInitialChooser.sss';


const shell = List(range(20).map(() => ''));


const LawInitialChooser = ({ initials, selected }) => (
  <Grid>
    {(initials.size ? initials : shell).map((char, idx) => (
      <Cell
        key={char || `shell-${idx}`}
        col={12}
        tablet={8}
        phone={1}
        className={styles.cell}
      >
      {char === '' ? <Button raised disabled /> : (
        <Link to={to({ initial: selected !== char.toLowerCase() ? char : '' })}>
          <Button ripple raised accent={selected === char.toLowerCase()}>
            {char}
          </Button>
        </Link>
      )}
      </Cell>
    ))}
  </Grid>
);

LawInitialChooser.propTypes = {
  initials: ImmutableTypes.listOf(PropTypes.string).isRequired,
  selected: PropTypes.string,
};


export default LawInitialChooser;
