import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Drawer as MaterialDrawer, Navigation } from 'react-mdl';


const Drawer = ({ navigation: { primary, secondary }, title }) => (
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
      {secondary.map((item, idx) => (
        <Link to={item.to} key={idx} className='mdl-navigation__link'>
          {item.text}
        </Link>
      ))}
    </Navigation>
  </MaterialDrawer>
);

Drawer.propTypes = {
  navigation: PropTypes.shape({
    primary: PropTypes.arrayOf(PropTypes.shape({
      to: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })),
    secondary: PropTypes.arrayOf(PropTypes.shape({
      to: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })),
  }),
  title: PropTypes.string,
};


export default Drawer;
