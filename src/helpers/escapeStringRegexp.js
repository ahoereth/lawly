import { isString } from 'lodash';

const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

export default function (str) {
  if (!isString(str)) { return str; }
  return str.replace(matchOperatorsRe, '\\$&');
}
