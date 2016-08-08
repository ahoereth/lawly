import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell, Button } from 'react-mdl';

import styles from './lawInitialChooser.sss';


const LawInitialChooser = ({ initials, selected, onSelect }) => (
  <Grid noSpacing>
    {initials.map(char => (
      <Cell key={char} col={12} tablet={8} phone={1} className={styles.cell}>
        <Button
          ripple raised
          accent={selected === char.toLowerCase()}
          className={styles.button}
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
