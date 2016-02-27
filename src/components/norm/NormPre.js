import React, { PropTypes } from 'react';
import { Card, CardText } from 'react-mdl';

import { isString } from 'helpers/utils';
import Html from 'components/Html';


export function handlePres(content, i) {
  if (!isString(content)) { return content; }

  const pres = content.match(/(.*?)<pre(.*?)>(.*?)<\/pre>/gi);
  if (pres) {
    content = [];
    pres.forEach((text, j) => {
      const start = text.indexOf('<pre');
      content.push(text.slice(0, start));
      content.push(
        <NormPre key={`pre-${i}-${j}`}>
          {text.slice(start, text.length)}
        </NormPre>
      );
    });
  }

  return content;
}


const NormPre = ({ children }) => {
  children = children.replace(/<pre.*?>/, '').replace('</pre>', '');

  return (
    <Card shadow={0} className='norm-pre'>
      <CardText>
        <pre><Html>{children}</Html></pre>
      </CardText>
    </Card>
  );
};

NormPre.propTypes = {
  children: PropTypes.string,
};


export default NormPre;
