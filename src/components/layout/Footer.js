import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
  Footer as MaterialFooter,
  FooterSection,
  FooterLinkList,
} from 'react-mdl';
import GitHubIcon from 'react-icons/go/mark-github';


const Footer = ({ navigation: { primary, secondary } }) => (
  <MaterialFooter size='mini'>
    <FooterSection logo='lawly.org'>
      <FooterLinkList>
        {primary.map((item, idx) => (
          <Link to={item.to} key={idx} className='mdl-navigation__link'>
            {item.text}
          </Link>
        ))}
        {secondary.map((item, idx) => (
          <Link to={item.to} key={idx} className='mdl-navigation__link'>
            {item.text}
          </Link>
        ))}
      </FooterLinkList>
    </FooterSection>
    <FooterSection type='right'>
      <FooterLinkList>
        <Link
          to='https://github.com/ahoereth/lawly'
          className='mdl-navigation__link'
          style={{ fontSize: '1.5em', color: '#000' }}
        >
          <GitHubIcon />
        </Link>
      </FooterLinkList>
    </FooterSection>
  </MaterialFooter>
);

Footer.propTypes = {
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
};


export default Footer;
