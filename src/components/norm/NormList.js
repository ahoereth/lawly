import React, { PropTypes } from 'react';

import { List } from 'components';


const NormList = ({ norms }) => {
  let list = [{ items: [] }];

  norms.forEach(norm => {
    let level = norm.enumeration.split('.').length;
    let currentList = list;
    while (0 < (level--)) {
      if (!currentList[currentList.length-1]) {
        currentList.push({ items: [] });
      }
      currentList = currentList[currentList.length-1].items;
    }

    currentList.push({ name: norm.title, items: [] });
  });

  return <List>{list}</List>;
};

NormList.propTypes = {
  norms: PropTypes.array.isRequired,
};


export default NormList;
