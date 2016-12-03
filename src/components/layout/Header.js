import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
  Icon, Tooltip,
  Header as MaterialHeader,
  HeaderRow,
  Navigation,
} from 'react-mdl';

import { SearchInput } from '~/components';
import { connectivity } from './header.sss';
import { background } from './layout.sss';


const Header = ({ isOnline, title, links, search, query, pathname = true }) => (
  <MaterialHeader transparent={pathname === '/'} waterfall className={background}>
    <HeaderRow title={title}>
      {isOnline ||
        <Tooltip label='Verbindung zum Server nicht verfügbar.'>
          <Icon name='flash_off' className={connectivity} />
        </Tooltip>
      }
      <Navigation>
        {links.map((item, idx) => (
          <Link to={item.to} key={idx} className='mdl-navigation__link'>
            {item.text}
          </Link>
        ))}
      </Navigation>
      <SearchInput
        query={query}
        search={search}
        expandable
      />
    </HeaderRow>
  </MaterialHeader>
);

Header.propTypes = {
  isOnline: PropTypes.bool.isRequired,
  pathname: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.object),
  query: PropTypes.string,
  search: PropTypes.func.isRequired,
  title: PropTypes.string,
};

Header.defaultProps = {
  title: 'Lawly',
};


export default Header;
