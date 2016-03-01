import React, { PropTypes } from 'react';
import { Textfield } from 'react-mdl';


const SearchInput = ({ expandable, query, style, search }) => (
  <Textfield
    value={query}
    onChange={(e) => search(e.currentTarget.value)}
    label='Suchanfrage'
    expandable={expandable}
    expandableIcon='search'
    floatingLabel={!expandable}
    style={style}
  />
);

SearchInput.propTypes = {
  expandable: PropTypes.bool,
  query: PropTypes.string,
  search: PropTypes.func.isRequired,
  style: PropTypes.object,
};

SearchInput.defaultProps = {
  search: '',
  expandable: false,
};


export default SearchInput;
