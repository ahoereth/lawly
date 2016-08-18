import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
  Header as MaterialHeader,
  HeaderRow,
  Navigation,
} from 'react-mdl';

import { SearchInput } from '~/components';


const Header = ({ title, links, search, query }) => (
  <MaterialHeader scroll>
    <HeaderRow title={title || 'woop'}>
      <SearchInput
        query={query}
        search={search}
        expandable
      />
    </HeaderRow>
    <HeaderRow>
      <Navigation>
        {links.map((item, idx) => (
          <Link to={item.to} key={idx} className='mdl-navigation__link'>
            {item.text}
          </Link>
        ))}
      </Navigation>
    </HeaderRow>
  </MaterialHeader>
);

Header.propTypes = {
  links: PropTypes.arrayOf(PropTypes.object),
  query: PropTypes.string,
  search: PropTypes.func.isRequired,
  title: PropTypes.string,
};


export default Header;
