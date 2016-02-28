import React, { PropTypes } from 'react';

import { handleHtml } from 'components/Html';
import { handleTables } from './NormTable';
import { handlePres } from './NormPre';
import { handleParagraphs } from './NormParagraphs';


function applyHandlers(handlers, content) {
  handlers.forEach(handler => {
    content = [].concat.apply([], content.map(handler));
  });

  return content;
}


const NormText = ({ children }) => {
  const content = applyHandlers([
    handleTables,
    handlePres,
    handleParagraphs,
    handleHtml,
  ], [children]);

  return <div>{content}</div>;
};

NormText.propTypes = {
  children: PropTypes.string,
};


export default NormText;
