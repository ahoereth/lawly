import React, { PropTypes } from 'react';


const Html = ({ className, children }) => (
  // eslint-disable-next-line react/no-danger
  <span className={className} dangerouslySetInnerHTML={{ __html: children }} />
);

Html.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};


export default Html;
