import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
  Footer as MaterialFooter,
  FooterSection,
  FooterLinkList
} from 'react-mdl';


class Footer extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    primary: PropTypes.arrayOf(PropTypes.object)
  };

  render() {
    const { title, primary } = this.props;

    return (
      <MaterialFooter size='mini'>
        <FooterSection type='bottom' logo={title || 'Lawly'}>
          <FooterLinkList style={{float: 'right'}}>
            {primary.map((item, idx) => (
              <Link to={item.to} key={idx} className='mdl-navigation__link'>
                {item.text}
              </Link>
            ))}
          </FooterLinkList>
        </FooterSection>
      </MaterialFooter>
    );
  }
}


export default Footer;
