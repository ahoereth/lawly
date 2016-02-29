import React, { PropTypes } from 'react';
import { Grid, Cell, Button } from 'react-mdl';


// Square single letter buttons.
const buttonStyle = {
  minWidth: 'auto',
  width: '36px',
  height: '36px',
  padding: 0,
  margin: '0 auto',
};

// Centered buttons.
const cellStyle = {
  marginBottom: '.5em',
  textAlign: 'center'
};

const LawInitialChooser = ({ initials, selected, onSelect }) => (
  <Grid noSpacing>
    {initials.map(initial => (
      <Cell key={initial} col={12} tablet={8} phone={1} style={cellStyle}>
        <Button
          ripple raised
          style={buttonStyle}
          disabled={selected == initial}
          onClick={() => onSelect(initial)}
        >
          {initial}
        </Button>
      </Cell>
    ))}
  </Grid>
);

LawInitialChooser.propTypes = {
  initials: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.string,
};


export default LawInitialChooser;
