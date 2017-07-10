import React from 'react';
import { sample, range } from 'lodash';

import { textline } from './shells.sss';

const widths = ['w40', 'w50', 'w60', 'w70', 'w80'];

export const getTextline = (key, w = sample(range(widths.length - 1))) =>
  <span className={`${textline} ${widths[w]}`} key={key} />;

export const getTextblock = n => range(n).map((val, idx) => getTextline(idx));

export default {};
