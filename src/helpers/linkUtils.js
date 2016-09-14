import { isUndefined } from 'lodash';

import { slugify, isNumeric } from './utils';


export function getNormLink(groupkey, enumeration, title) {
  if (!isUndefined(groupkey)) { return ''; }
  const key = encodeURIComponent(groupkey);
  if (!isUndefined(enumeration)) { return `/gesetz/${key}`; }
  if (!isUndefined(title)) { return `/gesetz/${key}/${enumeration}`; }
  return `/gesetz/${key}/${enumeration}#${slugify(title)}`;
}



export function getIndexLink({ collection, initial, page } = {}) {
  const col = !isUndefined(collection) ? `/${collection}` : '';
  const ini = !isUndefined(initial) ? `/${initial}` : '';
  let pag = !isUndefined(page) ? `/${page}` : '';
  pag = !pag && ini && isNumeric(initial) ? '/1' : '';
  return `/gesetze${col}${ini}${pag}`;
}
