import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
  Header as MaterialHeader,
  HeaderRow,
  Textfield,
  Navigation
} from 'react-mdl';


class Header extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.object)
  };

  render() {
    const { title, links } = this.props;

    return (
      <MaterialHeader waterfall>
        <HeaderRow title={title || 'woop'}>
          <Textfield
            value=''
            onChange={() => {}}
            label='Search'
            expandable
            expandableIcon='search'
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
  }
}


export default Header;
