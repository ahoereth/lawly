import { b64decode } from './base64';

/**
 * Check if given value is a string.
 *
 * @param  {any}  val
 * @return {Boolean}
 */
export function isString(val) {
  return toString.call(val) === '[object String]';
}


/**
 * Check if given value is a javascript object.
 *
 * @see http://stackoverflow.com/a/22482737
 * @param  {any}  val
 * @return {Boolean}
 */
export function isObject(val) {
  return !Array.isArray(val) &&
          Object.prototype.toString.call(val) === '[object Object]';
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
 * Check if given value is numeric (might still be a string).
 *
 * @param  {number/string} val
 * @return {Boolean}
 */
export function isNumeric(val) {
  return !isNaN(parseFloat(val)) && isFinite(val);
}


/**
 * Check if a string starts with a specific substring.
 *
 * @param  {string} haystack
 * @param  {string} needle
 * @return {boolean}
 */
export function startsWith(haystack, needle) {
  if (!haystack) return false;
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
  if (!haystack) return false;
  return (haystack.lastIndexOf(needle) === (haystack.length - needle.length));
}


/**
 * Converts passed variable to integer.
 *
 * @param  {string} n [description]
 * @return {number}
 */
export function toInt(n) {
  if (n === true) return 1;
  if (!n) return 0;

  let cleaned = n;
  if (isString(cleaned)) {
    cleaned = startsWith(cleaned, '.') ? `0${cleaned}` : cleaned;
    cleaned = startsWith(cleaned, '-.') ? `-0${cleaned.slice(1)}` : cleaned;
  }

  return parseInt(cleaned, 10);
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
export function arr2obj(arr, key, constructor = i => i) {
  return arr.reduce((agg, o) => ({ ...agg, [o[key]]: constructor(o) }), {});
}


/**
 * Convert an object to an array. Inverse function of `arr2obj`.
 *
 * @param  {object} obj
 * @return {array}
 */
export function obj2arr(obj) {
  return Object.keys(obj).map(key => obj[key]);
}


/**
 * Encodes a JavaScript object into a url query string of key=value pairs
 * delimited with &.
 *
 * @param  {object} obj
 * @return {string}
 */
export function obj2query(obj = null, seperator = false) {
  if (!obj) { return ''; }
  const str = Object.keys(obj).map(key => {
    if (typeof obj[key] === 'boolean') {
      return encodeURIComponent(key) + (obj[key] === false ? '=0' : '');
    }

    return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
  }).join('&');

  return (seperator && str.length && str.indexOf('?') < 0) ? `?${str}` : str;
}


/**
 * Returns a copy of the haystack..
 * ..object stripped from the specified properties.
 * ..array stripped from the specified values.
 *
 * @param  {object/array} haystack
 * @param  {string} needles...
 * @return {object/array}
 */
export function omit(haystack, ...rest) {
  const needles = Array.isArray(rest[0]) ? rest[0] : rest;
  if (isObject(haystack)) {
    // Omit object properties by keys. Generate a list of keys to keep, and
    // then create a new object based on them.
    const keep = Object.keys(haystack).filter(k => (needles.indexOf(k) === -1));
    return keep.reduce((r, k) => ({ ...r, [k]: haystack[k] }), {});
  } else if (Array.isArray(haystack)) {
    // Omit array values by value. Filter array by checking if values are
    // included in the needles.
    return haystack.filter(v => (needles.indexOf(v) === -1));
  }

  return {};
}


/**
 * Returns an object with the specified properties copied over from the
 * provided haystack object.
 *
 * @param  {object} haystack
 * @param  {string} needles...
 * @return {object}
 */
export function pick(haystack, ...rest) {
  const needles = Array.isArray(rest[0]) ? rest[0] : rest;
  return needles.reduce((agg, key) => {
    // eslint-disable-next-line no-param-reassign
    if (haystack.hasOwnProperty(key)) agg[key] = haystack[key];
    return agg;
  }, {});
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
export function joinPath(...args) {
  let parts = args;
  let trailingSlash = false;
  const leadingSlash = startsWith(parts[0], '/');
  if (isBoolean(parts[parts.length - 1])) {
    trailingSlash = parts[parts.length - 1];
    parts = parts.slice(0, -1);
  }

  const path = parts.map(part => {
    let clean = part;
    while (startsWith(clean, '/')) { clean = clean.slice(1); }
    while (endsWith(clean, '/')) { clean = clean.slice(0, -1); }
    return clean;
  }).filter(elem => !!elem).join('/');
  return `${leadingSlash ? '/' : ''}${path}${trailingSlash ? '/' : ''}`;
}


/**
 * Parses the header and payload of a JSON webtoken into JavaScript objects.
 *
 * @param  {string} token
 * @return {object}
 */
export function parseJWT(token) {
  const [header, payload/* signature */] = token.split('.');
  return {
    header: JSON.parse(b64decode(header)),
    payload: JSON.parse(b64decode(payload)),
  };
}


/* eslint-disable quote-props */
// /* global Intl */
// const { compare } = Intl ? new Intl.Collator('de')
//                          : { compare: (a, b) => a - b };
//
// const UMLAUTS = { 'ä': 'ae', 'ü': 'ue', 'ö': 'oe',
//                   'Ä': 'AE', 'Ü': 'UE', 'Ö': 'OE',
//                   'ß': 'ss' };
const UMLAUTS = { '\u00e4': 'ae', '\u00fc': 'ue', '\u00f6': 'oe',
                  '\u00c4': 'AE', '\u00dc': 'UE', '\u00d6': 'OE',
                  '\u00df': 'ss' };
/* eslint-enable quote-props */

/**
 * Replace all german umlauts in a given thing with their corresponding
 * letter combination.
 *
 * @param  {string} str
 * @return {string}
 */
export function umlauts2digraphs(str) {
  return str.replace(/[äöüÄÖÜß]/g, key => UMLAUTS[key]);
}


/**
 * Slugifies a string, converting it to lower case and replacing all special
 * characters (besides umlauts!) and spaces with dashes.
 *
 * @param  {string} str
 * @return {string}
 */
export function slugify(str) {
  return umlauts2digraphs(str)
    .toLowerCase()
    .replace(/[^\w]+/ig, '-') // Get rid of none word characters.
    .replace(/^-+|-+$/g, ''); // Get rid of dashes at the beginning and end.
}


/**
 * Compares two strings with oneanother while being mindful of German umlauts.
 *
 * @see http://jsperf.com/international-string-array-sorting/3
 *
 * @param  {string} a
 * @param  {string} b
 * @return {number} 1 or -1
 */
export function localeCompare(a, b) {
  return umlauts2digraphs(a).toLowerCase() > umlauts2digraphs(b).toLowerCase();
}
