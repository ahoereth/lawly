import React, { PropTypes } from 'react';

import SearchIcon from 'react-icons/md/search';

import { Textfield } from '~/components';


function submit({ nativeEvent, currentTarget }, handler) {
  if (nativeEvent.charCode === 13) {
    handler(currentTarget.value);
  }
}

const SearchInput = ({ expandable, query, search, ...otherProps }) => (
  <Textfield
    value={query}
    onChange={e => search(e.currentTarget.value)}
    onKeyPress={e => submit(e, search)}
    label='Suchanfrage'
    expandable={expandable}
    expandableIcon={<SearchIcon />}
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
