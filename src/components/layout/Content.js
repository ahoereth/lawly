import React, { PropTypes } from 'react';
import { Content as MaterialContent } from 'react-mdl';


const Content = ({ children }) => (
  <MaterialContent>
    {children}
  </MaterialContent>
);

Content.propTypes = {
  children: PropTypes.node.isRequired,
};


export default Content;
