import React, { PropTypes } from 'react';
import { List } from 'immutable';
import { range } from 'lodash';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell, Button } from 'react-mdl';

import styles from './lawInitialChooser.sss';


const shell = List(range(20).map(() => ''));


const LawInitialChooser = ({ initials, selected, onSelect }) => (
  <Grid>
    {(initials.size ? initials : shell).map((char, idx) => (
      <Cell
        key={char || `shell-${idx}`}
        col={12}
        tablet={8}
        phone={1}
        className={styles.cell}
      >
        <Button
          ripple raised
          disabled={char === ''}
          accent={selected === char.toLowerCase()}
          onClick={() => onSelect(selected !== char.toLowerCase() ? char : '')}
        >
          {char}
        </Button>
      </Cell>
    ))}
  </Grid>
);

LawInitialChooser.propTypes = {
  initials: ImmutableTypes.listOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.string,
};


export default LawInitialChooser;
