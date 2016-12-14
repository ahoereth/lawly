import React, { PropTypes } from 'react';
import cn from 'classnames';
import { Link } from 'react-router';
import { Tooltip, Header as MdHeader, HeaderRow, Navigation } from 'react-mdl';

import FlashOffIcon from 'react-icons/md/flash-off';

import { SearchInput } from '~/components';
import { header, row, nav, searchinput } from './header.sss';
import { background } from './layout.sss';


const Header = ({ isOnline, title, links, search, query }) => (
  <MdHeader
    transparent
    waterfall
    className={cn(header, background, { online: isOnline, offline: !isOnline })}
  >
    <HeaderRow title={title} className={row}>
      {isOnline ||
        <Tooltip label='Verbindung zum Server nicht verfügbar.'>
          <FlashOffIcon />
        </Tooltip>
      }
      <Navigation className={nav}>
        {links.map((item, idx) => (
          <Link to={item.to} key={idx} className='mdl-navigation__link'>
            {item.text}
          </Link>
        ))}
      </Navigation>
      <SearchInput
        className={searchinput}
        query={query}
        search={search}
        expandable
      />
    </HeaderRow>
  </MdHeader>
);

Header.propTypes = {
  isOnline: PropTypes.bool.isRequired,
  // pathname: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.object),
  query: PropTypes.string,
  search: PropTypes.func.isRequired,
  title: PropTypes.string,
};

Header.defaultProps = {
  title: 'Lawly',
};


export default Header;
