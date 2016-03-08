export function startsWith(haystack, needle) {
  return (haystack.indexOf(needle) === 0);
}

export function endsWith(haystack, needle) {
  return (haystack.indexOf(needle) === (haystack.length - needle.length));
}


/**
 * Check if given value is a string.
 *
 * @param  {any}  val
 * @return {Boolean}
 */
export function isString(val) {
  return toString.call(val) == '[object String]';
}


/**
 * Check if given varaible is undefined.
 *
 * @param  {any} x
 * @return {Boolean}
 */
export function isUndefined(x) {
  return (typeof x === 'undefined');
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^\wüöä]+/ig, '-');
}
