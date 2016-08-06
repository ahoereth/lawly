import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell, Button } from 'react-mdl';

import styles from './lawInitialChooser.sss';

const LawInitialChooser = ({ initials, selected, onSelect }) => (
  <Grid noSpacing>
    {initials.map(initial => (
      <Cell key={initial} col={12} tablet={8} phone={1} className={styles.cell}>
        <Button
          ripple raised
          accent={selected === initial.toLowerCase()}
          className={styles.button}
          onClick={() => onSelect(selected !== initial.toLowerCase() ? initial : '')}
        >
          {initial}
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
