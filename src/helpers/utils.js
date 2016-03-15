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
 * Check if given value is a javascript object.
 *
 * @see http://stackoverflow.com/a/22482737
 * @param  {any}  val
 * @return {Boolean}
 */
export function isObject(val) {
  if (val === null) {
    return false;
  }

  return ( (typeof val === 'function') || (typeof val === 'object') );
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


/**
 * Check if a string starts with a specific substring.
 *
 * @param  {string} haystack
 * @param  {string} needle
 * @return {boolean}
 */
export function startsWith(haystack, needle) {
  return (haystack.indexOf(needle) === 0);
}


/**
 * Checks if a string ends with a specific substring.
 *
 * @param  {string} haystack
 * @param  {string/array} needle
 * @return {boolean}
 */
export function endsWith(haystack, needle) {
  return (haystack.indexOf(needle) === (haystack.length - needle.length));
}


/**
 * Slugifies a string, converting it to lower case and replacing all special
 * characters (besides umlauts!) and spaces with dashes.
 *
 * @param  {string} str
 * @return {string}
 */
export function slugify(str) {
  return str.toLowerCase().replace(/[^\wüöä]+/ig, '-');
}
