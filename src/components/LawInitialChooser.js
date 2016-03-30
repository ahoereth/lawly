import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Grid, Cell, Button } from 'react-mdl';

import styles from './lawInitialChooser.sss';

const LawInitialChooser = ({ initials, selected, onSelect }) => (
  <Grid noSpacing>
    {initials.map(initial => (
      <Cell key={initial} col={12} tablet={8} phone={1} className={styles.cell}>
        <Button
          ripple raised
          className={styles.button}
          disabled={selected == initial.toLowerCase()}
          onClick={() => onSelect(initial)}
        >
          {initial}
        </Button>
      </Cell>
    ))}
  </Grid>
);

LawInitialChooser.propTypes = {
  initials: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.string,
};


export default LawInitialChooser;
