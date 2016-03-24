import { b64decode } from './base64';

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
  if (val === null) { return false; }
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
 * Check if given varaible is a boolean.
 *
 * @param  {any} x
 * @return {Boolean}
 */
export function isBoolean(x) {
  return (typeof x === 'boolean');
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
 * Parses the header and payload of a JSON webtoken into JavaScript objects.
 *
 * @param  {string} token
 * @return {object}
 */
export function parseJWT(token) {
  const [ header, payload/*, signature*/ ] = token.split('.');
  return {
    header: JSON.parse(b64decode(header)),
    payload: JSON.parse(b64decode(payload)),
  };
}


/**
 * Encodes a JavaScript object into a url query string of key=value pairs
 * delimited with &.
 *
 * @param  {object} obj
 * @return {string}
 */
export function obj2query(obj = null) {
  if (!obj) { return ''; }
  let str = '';
  for (let key in obj) {
    if (str !== '') { str += '&'; }
    str += key + '=' + encodeURIComponent(obj[key]);
  }
  return str;
}


/**
 * Convert an array of objects to an object of objects using a specific key
 * of the original objects as key for the new object. CAUTION: Objects further
 * down in the array overwrite earlier objects with the same key value.
 *
 * @param  {array} arr
 * @param  {string} key
 * @return {object}
 */
export function arr2obj(arr, key) {
  return arr.reduce((agg, obj) => {
    agg[obj[key]] = obj;
    return agg;
  }, {});
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


/**
 * Joins a list of strings into a single forward slash seperated path string
 * with optional trailing slash.
 *
 * @param  {string} part1
 * @param  {string} part2
 * @param  {string} partN
 * @param  {boolean} trailingSlash
 * @return {string}
 */
export function joinPath(/* parts, trailingSlash = false */) {
  let path = arguments[0];
  let n = arguments.length; n = !isBoolean(arguments[n-1]) ? n : n - 1;
  let trailingSlash = isBoolean(arguments[n-1]) ? arguments[n-1] : false;

  for (let i = 1; i < n; i++) {
    let a = endsWith(path, '/'), b = startsWith(arguments[i], '/');
         if (a && b) { path = path.slice(0, -1) + arguments[i]; }
    else if (a || b) { path += arguments[i]; }
    else             { path += '/' + arguments[i]; }
  }

  if ( trailingSlash && !endsWith(path, '/')) { path += '/'; }
  if (!trailingSlash &&  endsWith(path, '/')) { path  = path.slice(0, -1); }

  return path;
}
