import React, { PropTypes } from 'react';
import cs from 'classnames';

import { handleHtml } from 'components/Html';
import { handleTables } from './NormTable';
import { handlePres } from './NormPre';
// import { handleParagraphs } from './NormParagraphs';


function applyHandlers(handlers, content) {
  handlers.forEach(handler => {
    content = [].concat.apply([], content.map(handler));
  });

  return content;
}


const NormText = ({ children, footnote }) => {
  if (!children) { return <span />; }

  const content = applyHandlers([
    handleTables,
    handlePres,
    // handleParagraphs,
    handleHtml,
  ], [children]);

  return <div className={cs({footnote})}>{content}</div>;
};

NormText.propTypes = {
  children: PropTypes.string,
  footnote: PropTypes.bool
};

NormText.defaultProps = {
  footnote: false,
};


export default NormText;
