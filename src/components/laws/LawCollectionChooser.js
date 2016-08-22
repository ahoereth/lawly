import React, { PropTypes } from 'react';
import { List } from 'immutable';
import { range } from 'lodash';
import ImmutableTypes from 'react-immutable-proptypes';
import { Grid, Cell, Button } from 'react-mdl';


const shell = List(range(4).map(() => ''));


const LawCollectionChooser = ({ collections, selected, onSelect }) => (
  <Grid>
    {(collections.size ? collections : shell).map((title, idx) => (
      <Cell
        key={title || `shell-${idx}`}
        col={3}
        tablet={4}
        phone={4}
      >
        <Button
          ripple raised
          disabled={title === ''}
          accent={selected === title}
          onClick={() => onSelect(selected !== title ? title : '')}
          style={{ width: '100%' }}
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
