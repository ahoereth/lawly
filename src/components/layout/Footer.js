import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
  Footer as MaterialFooter,
  FooterSection,
  FooterLinkList,
} from 'react-mdl';


const Footer = ({ title, primary }) => (
  <MaterialFooter size='mega'>
    <FooterSection type='bottom' logo={title || 'Lawly'}>
      <FooterLinkList style={{ float: 'right' }}>
        {primary.map((item, idx) => (
          <Link to={item.to} key={idx} className='mdl-navigation__link'>
            {item.text}
          </Link>
        ))}
      </FooterLinkList>
    </FooterSection>
  </MaterialFooter>
);

Footer.propTypes = {
  primary: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};


export default Footer;
