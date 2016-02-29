import React, { PropTypes } from 'react';

import { isString } from 'helpers/utils';


export function handleHtml(content, i) {
  if (!isString(content)) { return content; }
  content = <Html className='norm-text' key={`html-${i}`}>{content}</Html>;
  return content;
}


const Html = ({ className, children }) => (
  <span className={className} dangerouslySetInnerHTML={{__html: children}} />
);

Html.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};


export default Html;
