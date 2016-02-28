import React, { PropTypes } from 'react';
import { Card, CardText } from 'react-mdl';

import { isString } from 'helpers/utils';


export function handlePres(input, i) {
  if (!isString(input)) { return input; }

  let output = input;
  const pres = input.match(/.*?<pre.*?>.*?<\/pre>/gi);
  if (pres) {
    output = [];
    pres.forEach((text, j) => {
      // Handle everything before the first and between each pre.
      const start = text.indexOf('<pre');
      output.push(text.slice(0, start));

      // Handle each pre.
      output.push(
        <NormPre key={`pre-${i}-${j}`}>
          {text.slice(start, text.length)}
        </NormPre>
      );

      // Handle everything after the last pre.
      if ((j+1) === pres.length) {
        const end = input.lastIndexOf(text) + text.length;
        output.push(input.slice(end, input.length));
      }
    });
  }

  return output;
}


const NormPre = ({ children }) => {
  children = children.replace(/<pre.*?>/, '').replace('</pre>', '');

  return (
    <Card shadow={0} style={{width: '100%', minHeight: 0}}>
      <CardText>
        <pre dangerouslySetInnerHTML={{__html: children}} style={{margin: 0}} />
      </CardText>
    </Card>
  );
};

NormPre.propTypes = {
  children: PropTypes.string,
};


export default NormPre;
