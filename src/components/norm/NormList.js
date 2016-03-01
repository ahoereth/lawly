import React, { PropTypes } from 'react';

import { List } from 'components';


const NormList = ({ norms }) => {
  let list = [];

  norms.forEach(norm => {
    if (norm.gliederungseinheit) {
      const { gliederungseinheit: einheit, enbez } = norm;
      const { gliederungsbez: bez, gliederungstitel: titel } = einheit;
      list.push({
        name: enbez ? enbez : bez + (titel ? ': ' + titel : '')
      });
    } else if (norm.enbez) {
      let len = list.length-1;
      if (!list[len]) {
        list[len] = {};
      }
      if (!list[len].items) {
        list[len].items = [];
      }

      list[len].items.push({ name: norm.enbez });
    }
  });

  return <List>{list}</List>;
};

NormList.propTypes = {
  norms: PropTypes.array.isRequired,
};


export default NormList;
