import React, { PropTypes } from 'react';
import { Textfield } from 'react-mdl';


const SearchInput = ({ expandable, query, search, ...otherProps }) => (
  <Textfield
    value={query}
    onChange={(e) => search(e.currentTarget.value)}
    label='Suchanfrage'
    expandable={expandable}
    expandableIcon='search'
    floatingLabel={!expandable}
    {...otherProps}
  />
);

SearchInput.propTypes = {
  expandable: PropTypes.bool,
  query: PropTypes.string,
  search: PropTypes.func.isRequired,
};

SearchInput.defaultProps = {
  query: '',
  expandable: false,
};


export default SearchInput;
