import { slugify } from './utils';


export default function getNormLink(groupkey, enumeration, title) {
  if (!groupkey) { return ''; }
  const key = encodeURIComponent(groupkey);
  if (!enumeration) { return `/gesetz/${key}`; }
  if (!title) { return `/gesetz/${key}/${enumeration}`; }
  return `/gesetz/${key}/${enumeration}#${slugify(title)}`;
}
