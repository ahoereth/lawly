import React, { PropTypes } from 'react';
import Immutable from 'immutable';

import { slugify } from 'helpers/utils';
import { List } from 'components';


const NormList = ({ norms }) => {
  let list = [];

  norms.slice(1).forEach(norm => {
    let level = norm.get('enumeration').split('.').length - 1;
    let currentList = list;
    while (0 < (level--)) {
      if (!currentList[currentList.length-1]) {
        currentList.push({ items: [] });
      }
      currentList = currentList[currentList.length-1].items;
    }

    currentList.push({
      name: <a href={'#'+slugify(norm.get('title'))}>{norm.get('title')}</a>,
      items: []
    });
  });

  return <List>{list}</List>;
};

NormList.propTypes = {
  norms: PropTypes.instanceOf(Immutable.List).isRequired,
  // norms: PropTypes.arrayOf(PropTypes.shape({
  //   title: PropTypes.string.isRequired,
  //   enumeration: PropTypes.string.isRequired,
  // })).isRequired,
};


export default NormList;
