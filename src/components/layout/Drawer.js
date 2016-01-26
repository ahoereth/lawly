import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Drawer as MaterialDrawer, Navigation } from 'react-mdl';


class Drawer extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    primary: PropTypes.arrayOf(PropTypes.object)
  };

  render() {
    const { title, primary } = this.props;

    return (
      <MaterialDrawer title={title}>
        <Navigation>
          {primary.map((item, idx) => (
            <Link to={item.to} key={idx} className='mdl-navigation__link'>
              {item.text}
            </Link>
          ))}
        </Navigation>
      </MaterialDrawer>
    );
  }
}


export default Drawer;
