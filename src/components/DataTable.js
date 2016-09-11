import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { List } from 'immutable';
import classNames from 'classnames';
import { range, sample, isPlainObject as isObj } from 'lodash';

import { getTextblock } from '~/helpers/shells';


function getRows(rows, shellBase) {
  const shell = shellBase.set('shell', true);
  return rows.size ? rows : List(range(20)).map(() => shell);
}


// eslint-disable-next-line react/prop-types
function renderCell({ name, numeric }, row) {
  const className = !numeric ? 'mdl-data-table__cell--non-numeric' : '';
  let val = row.get(name, '');
  if ((!val || (isObj(val) && val.type === 'shell')) && row.get('shell')) {
    val = getTextblock(val.lines ? sample(val.lines) : 1);
  }

  return <td key={name} className={className}>{val}</td>;
}


const propTypes = {
  className: PropTypes.string,
  keyProp: PropTypes.string,
  rows: ImmutableTypes.listOf(ImmutableTypes.map).isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  shell: ImmutableTypes.map,
};


const DataTable = ({
  className,
  children,
  keyProp,
  rows,
  shell,
  ...others,
}) => {
  const classes = classNames('mdl-data-table', className);
  const columns = React.Children.toArray(children);
  return (
    <table className={classes} {...others}>
      <thead>
        <tr>{columns}</tr>
      </thead>
      <tbody>
        {getRows(rows, shell).map((row, idx) =>
          <tr key={row.get(keyProp, idx)}>
            {columns.map(column => renderCell(column.props, row))}
          </tr>
        )}
      </tbody>
    </table>
  );
};

DataTable.propTypes = propTypes;


export default DataTable;
