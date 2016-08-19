import React from 'react';
import { sample, range } from 'lodash';

import { textline } from './shells.sss';


const widths = ['w80', 'w70', 'w60', 'w50', 'w40'];


export const getTextline = (key) => (
  <span className={`${textline} ${sample(widths)}`} key={key} />
);

export const getTextblock = (n) => range(n).map((val, idx) => getTextline(idx));

export default {};
