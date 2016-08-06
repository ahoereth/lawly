import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell, Button } from 'react-mdl';


const LawCollectionChooser = ({ collections, selected, onSelect }) => (
  <Grid noSpacing>
    {collections.map(title => (
      <Cell key={title} col={3} tablet={4} phone={1}>
        <Button
          ripple raised
          accent={selected === title}
          onClick={() => onSelect(selected !== title ? title : '')}
        >
          {title}
        </Button>
      </Cell>
    ))}
  </Grid>
);

LawCollectionChooser.propTypes = {
  collections: ImmutableTypes.listOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.string,
};


export default LawCollectionChooser;
