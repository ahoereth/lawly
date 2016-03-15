import React, { PropTypes } from 'react';


class List extends React.Component {
  createList = (arr, otherProps) => (
    <ul {...otherProps}>
      {arr.map((li, i) =>
        <li key={i}>
          {!li.name ? false : <span>{li.name}</span>}
          {!li.items ? false : this.createList(li.items)}
        </li>
      )}
    </ul>
  );

  render() {
    const { children, ...otherProps} = this.props;
    return this.createList(children, otherProps);
  }
}

List.propTypes = {
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
};


export default List;
