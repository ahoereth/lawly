import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { List } from 'immutable';
import classNames from 'classnames';
import { range, sample, isFunction } from 'lodash';
import styles from './dataTable.sss';


const widths = ['a', 'b', 'c', 'd', 'e'];


class DataTable extends React.Component {
  getRows(rows, shellBase) {
    const shell = shellBase.set('shell', true);
    return rows.size > 10 ? rows : List(range(10)).map(() => shell);
  }

  renderCell({ name, numeric }, row) {
    const className = numeric ? 'mdl-data-table__cell--non-numeric' : '';
    let val = row.get(name, '');
    if (!val) {
      val = <span className={`${styles.rowshell} ${sample(widths)}`} />;
    } else if (isFunction(val)) {
      val = <span className={styles.rowshell}>{val(widths)}</span>;
    }

    return <td key={name} className={className}>{val}</td>;
  }

  render() {
    const { className, children, keyProp, rows, shell, ...others } = this.props;
    const classes = classNames('mdl-data-table', className);
    const columns = React.Children.toArray(children);

    return (
      <table className={classes} {...others}>
        <thead>
          <tr>{columns}</tr>
        </thead>
        <tbody>
          {this.getRows(rows, shell).map((row, idx) =>
            <tr key={row.get(keyProp, idx)}>
              {columns.map(column => this.renderCell(column.props, row))}
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}


DataTable.propTypes = {
  className: PropTypes.string,
  keyProp: PropTypes.string,
  rows: ImmutableTypes.listOf(ImmutableTypes.map).isRequired,
  children: PropTypes.any.isRequired, // TODO: List of instances of TableHeader
  shell: ImmutableTypes.map,
};


export default DataTable;
