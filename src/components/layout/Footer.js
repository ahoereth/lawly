import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
  Footer as MaterialFooter,
  FooterSection,
  FooterLinkList,
} from 'react-mdl';
import github from 'icons/github.svg';


const Footer = ({ primary }) => (
  <MaterialFooter size='mini'>
    <FooterSection logo='lawly.org'>
      <FooterLinkList>
        {primary.map((item, idx) => (
          <Link to={item.to} key={idx} className='mdl-navigation__link'>
            {item.text}
          </Link>
        ))}
        <Link to='/kontakt' className='mdl-navigation__link'>Kontakt</Link>
      </FooterLinkList>
    </FooterSection>
    <FooterSection type='right'>
      <FooterLinkList>
        <Link to='https://github.com/ahoereth/lawly' className='mdl-navigation__link'>
          <img alt='github' src={github} style={{ width: 24, height: 24 }} />
        </Link>
      </FooterLinkList>
    </FooterSection>
  </MaterialFooter>
);

Footer.propTypes = {
  primary: PropTypes.arrayOf(PropTypes.object),
};


export default Footer;
