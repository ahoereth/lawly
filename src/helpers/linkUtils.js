import { slugify, isNumeric } from './utils';


export function getNormLink(groupkey, enumeration, title) {
  if (!groupkey) { return ''; }
  const key = encodeURIComponent(groupkey);
  if (!enumeration) { return `/gesetz/${key}`; }
  if (!title) { return `/gesetz/${key}/${enumeration}`; }
  return `/gesetz/${key}/${enumeration}#${slugify(title)}`;
}



export function getIndexLink({ collection, initial, page } = {}) {
  const col = collection ? `/${collection}` : '';
  const ini = initial ? `/${initial}` : '';
  let pag = page ? `/${page}` : '';
  pag = !page && initial && isNumeric(initial) ? '/1' : pag;
  return `/gesetze${col}${ini}${pag}`;
}
