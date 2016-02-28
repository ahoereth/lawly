import React, { PropTypes } from 'react';

import { isString } from 'helpers/utils';
import Html from 'components/Html';


export function handleParagraphs(input, i) {
  if (!isString(input)) { return input; }

  let output = input;
  const paragraphs = input.match(/.*?<p.*?>(\(\d+\))?.*?<\/p>/gi);
  if (paragraphs) {
    output = [];
    paragraphs.forEach((text, j) => {
      const parts = text.match(/(.*?)<p.?>(?:\((\d+)\))?(.*?)<\/p>$/i);

      // Handle everything before the first and between each p.
      if (parts[1]) {
        output.push(parts[1]);
      }

      // Handle each p.
      output.push(
        <NormParagraph key={`p-${i}-${j}`} number={parseInt(parts[2], 10)}>
          {parts[3]}
        </NormParagraph>
      );

      // Handle everything after the last p.
      if ((j+1) === paragraphs.length) {
        const end = input.lastIndexOf(text) + text.length;
        output.push(input.slice(end, input.length));
      }
    });
  }

  return output;
}



const NormParagraph = ({ children, number }) => {
  return (
    <p>
      {!number ? false : <strong>({number})</strong>}
      <Html>{children}</Html>
    </p>
  );
};

NormParagraph.propTypes = {
  children: PropTypes.string.isRequired,
  number: PropTypes.number,
};


export default NormParagraph;
