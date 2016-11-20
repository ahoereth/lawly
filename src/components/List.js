import React, { PropTypes } from 'react';


class List extends React.Component {
  createList = (arr, otherProps) => (
    <ul {...otherProps}>
      {arr.map((li, i) => (
        <li key={i}>
          {!li.name ? false : <span>{li.name}</span>}
          {!li.items ? false : this.createList(li.items)}
        </li>
      ))}
    </ul>
  );

  render() {
    const { children, ...otherProps } = this.props;
    return this.createList(children, otherProps);
  }
}

// See github.com/yannickcr/eslint-plugin-react/issues/816
/* eslint-disable react/no-unused-prop-types */
List.propTypes = {
  children: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    items: PropTypes.array,
  })).isRequired,
};


export default List;
