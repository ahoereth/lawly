import React, { PropTypes } from 'react';


const Html = ({ className, children }) => (
  <span className={className} dangerouslySetInnerHTML={{ __html: children }} />
);

Html.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};


export default Html;
