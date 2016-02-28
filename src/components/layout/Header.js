import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import debounce from 'lodash.debounce';
import {
  Header as MaterialHeader,
  HeaderRow,
  Textfield,
  Navigation
} from 'react-mdl';


class Header extends React.Component {
  static propTypes = {
    links: PropTypes.arrayOf(PropTypes.object),
    search: PropTypes.func.isRequired,
    title: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.dispatchSearch = debounce(props.search, 500);
  }


  search(e) {
    const query = e.currentTarget.value;
    this.setState({ query });
    this.dispatchSearch(query);
  }

  dispatchSearch() {}


  render() {
    const { title, links } = this.props;
    const { query } = this.state;

    return (
      <MaterialHeader waterfall>
        <HeaderRow title={title || 'woop'}>
          <Textfield
            value={query}
            onChange={(e) => this.search(e)}
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
