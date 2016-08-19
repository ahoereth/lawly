import React, { PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import classNames from 'classnames';


class DataTable extends React.Component {
  renderCell({ name, numeric }, row) {
    const className = !numeric ? 'mdl-data-table__cell--non-numeric' : '';
    return <td key={name} className={className}>{row.get(name)}</td>;
  }

  render() {
    const { className, children, rowKeyAttr, rows, ...others } = this.props;
    const classes = classNames('mdl-data-table', className);
    const columns = React.Children.toArray(children);

    return (
      <table className={classes} {...others}>
        <thead>
          <tr>{columns}</tr>
        </thead>
        <tbody>
          {rows.map((row, idx) =>
            <tr key={row.get(rowKeyAttr, idx)}>
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
  rowKeyAttr: PropTypes.string,
  rows: ImmutableTypes.listOf(ImmutableTypes.map).isRequired,
  children: PropTypes.any.isRequired, // TODO
};


export default DataTable;
