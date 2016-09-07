import { isString } from 'lodash';

export default function semverCompare(a, b) {
  if (!isString(a) || !isString(b)) { return 0; }
  const segmentsA = a.replace(/(\.0+)+$/, '').split('.');
  const segmentsB = b.replace(/(\.0+)+$/, '').split('.');
  const len = Math.min(segmentsA.length, segmentsB.length);

  for (let diff, i = 0; i < len; i++) {
    diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
    if (diff !== 0) {
      return diff;
    }
  }

  return segmentsA.length - segmentsB.length;
}
