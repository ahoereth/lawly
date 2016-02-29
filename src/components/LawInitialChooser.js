import React, { PropTypes } from 'react';
import { Button } from 'react-mdl';


const LawInitialChooser = ({ initials, selected, onSelect }) => (
  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
    {initials.map(initial => (
      <li key={initial}>
        <Button
          ripple raised
          disabled={selected == initial}
          onClick={() => onSelect(initial)}
        >
          {initial}
        </Button>
      </li>
    ))}
  </ul>
);

LawInitialChooser.propTypes = {
  initials: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.string,
};


export default LawInitialChooser;
