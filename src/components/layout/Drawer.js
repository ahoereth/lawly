import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Drawer as MaterialDrawer, Navigation } from 'react-mdl';


const Drawer = ({ primary, title }) => (
  <MaterialDrawer title={title}>
    <Navigation>
      {primary.map((item, idx) => (
        <Link to={item.to} key={idx} className='mdl-navigation__link'>
          {item.text}
        </Link>
      ))}
      <Link to='/suche' className='mdl-navigation__link'>
        Suche
      </Link>
    </Navigation>
  </MaterialDrawer>
);

Drawer.propTypes = {
  primary: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};


export default Drawer;
