import React, { PropTypes } from 'react';
import { Card, CardText } from 'react-mdl';

import { isString } from 'helpers/utils';


export function handleTables(content, i) {
  if (!isString(content)) { return content; }

  const tables = content.match(/(.*?)<table(.*?)>(.*?)<\/table>/gi);
  if (tables) {
    content = [];
    tables.forEach((text, j) => {
      const start = text.indexOf('<table');
      content.push(text.slice(0, start));
      content.push(
        <NormTable key={`table-${i}-${j}`}>
          {text.slice(start, text.length)}
        </NormTable>
      );
    });
  }

  return content;
}


const NormTable = ({ children }) => {
  let rows = [[]], maxlen = 0;
  children
    .slice(children.indexOf('<row'), children.lastIndexOf('</row>') + 6)
    .replace(/<row.*?>/gi, '') // Remove opening row tags.
    .split('</row>') // Split into array.
    .slice(0, -1) // Remove superflous last element.
    .forEach((row, i) => {
      rows[i+1] = [];
      const entries = row.split('</entry>').slice(0, -1);
      maxlen = maxlen < entries.length ? entries.length : maxlen;
      let j = 0;
      entries.forEach(entry => {
        while (typeof rows[i][j] !== 'undefined') { j++; }
        rows[i][j] = <td key={j}>{entry.replace(/<entry.*?>/, '')}</td>;
        if ((/morerows="\d+?"/).test(entry)) {
          rows[i+1][j] = <td key={j}/>;
        }
      }); // End entry loop.
    }); // End row loop.

  // Ensure that every row has the full length;
  rows = rows.map(row => {
    while (row.length < maxlen) { row.push(<td key={row.length}/>); }
    return row;
  });

  return (
    <Card shadow={0} className='norm-table'>
      <CardText>
        <table>
          <tbody>
            {rows.map((cols, i) => {
              return <tr key={i}>{cols}</tr>;
            })}
          </tbody>
        </table>
      </CardText>
    </Card>
  );
};

NormTable.propTypes = {
  children: PropTypes.string,
};


export default NormTable;
