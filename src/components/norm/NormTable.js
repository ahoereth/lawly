import React, { PropTypes } from 'react';
import cs from 'classnames';
import { Card, CardText } from 'react-mdl';

import { isString, isUndefined } from 'helpers/utils';
import './normTable.scss';


export function handleTables(input, i) {
  if (!isString(input)) { return input; }

  let output = input;
  const tables = input.match(/(.*?)<table.*?>.*?<\/table>/gi);
  if (tables) {
    output = [];
    tables.forEach((text, j) => {
      // Handle everything before the first and between each table.
      const start = text.indexOf('<table');
      output.push(text.slice(0, start));

      // Handle each table.
      output.push(
        <NormTable key={`table-${i}-${j}`}>
          {text.slice(start, text.length)}
        </NormTable>
      );

      // Handle everything after the last table.
      if ((j+1) === tables.length) {
        const end = input.lastIndexOf(text) + text.length;
        output.push(input.slice(end, input.length));
      }
    });
  }

  return output;
}


const NormTable = ({ children }) => {
  let rows = [], maxlen = 0;
  children
    .slice(children.indexOf('<row'), children.lastIndexOf('</row>') + 6)
    .replace(/<row.*?>/gi, '') // Remove opening row tags.
    .split('</row>') // Split into array.
    .slice(0, -1) // Remove superflous last element.
    .forEach((row, y) => {
      if (isUndefined(rows[y])) { rows[y] = []; } // Init current row.
      const entries = row.split('</entry>').slice(0, -1); // Get row entries.
      maxlen = maxlen < entries.length ? entries.length : maxlen; // Keep count.
      let x = 0; // Reset x position.
      entries.forEach(entry => {
        // Find current cells x position.
        while (!isUndefined(rows[y][x])) { x++; }

        // Check if current cell spans multiple rows.
        let more = entry.match(/morerows="(\d+?)"/i);
        more = more ? parseInt(more[1], 10) : 0;

        // Handle current table cell.
        const html = { __html: entry.replace(/<entry.*?>/, '')};
        rows[y][x] = (
          <td
            key={x}
            dangerouslySetInnerHTML={html}
            className={cs({colbottom: !more})}
          />
        );

        // Handle rows spanning multiple rows.
        for (let n = 1; n <= more; n++) {
          if (isUndefined(rows[y+n])) { rows[y+n] = []; }
          rows[y+n][x] = <td key={x} className={cs({colbottom: n == more})} />;
        }
      }); // End entry loop.
    }); // End row loop.

  // Ensure that every row has the full length.
  rows = rows.map(row => {
      while (row.length < maxlen) {
        row.push(<td key={row.length} className='colbottom' />); 
      }
      return row;
    });

  return (
    <Card shadow={0} className='norm-table'>
      <CardText>
        <table>
          <tbody>
            {rows.map((cols, i) => <tr key={i}>{cols}</tr>)}
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
