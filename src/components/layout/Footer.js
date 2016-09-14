import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
  Footer as MaterialFooter,
  FooterSection,
  FooterLinkList,
} from 'react-mdl';


const Footer = ({ primary }) => (
  <MaterialFooter size='mini'>
    <FooterSection logo='lawly.org'>
      <FooterLinkList>
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
};


export default Footer;
