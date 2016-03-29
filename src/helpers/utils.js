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
  return (haystack.lastIndexOf(needle) === (haystack.length - needle.length));
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
  return arr.reduce((agg, obj) => {
    agg[obj[key]] = constructor(obj);
    return agg;
  }, {});
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
export function obj2query(obj = null) {
  if (!obj) { return ''; }
  let str = '';
  for (let key in obj) {
    if (str !== '') { str += '&'; }
    if (typeof obj[key] === 'boolean') {
      str += encodeURIComponent(key) + (obj[key] === false ? '=0' : '');
    } else {
      str += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    }
  }
  return str;
}


// export function format(haystack/*, ...*/) {
//   // Second argument is an object of needle/replace-value pairs.
//   if (isObject(arguments[1])) {
//     for (let needle in arguments[1]) {
//       if (!arguments[1].hasOwnProperty(needle)) { continue; }
//       haystack = haystack.replace(':' + needle, arguments[1][needle]);
//     }
//
//     return haystack;
//   }
//
//   // Second+ arguments are strings to be replaced in order. Haystack should
//   // contain identifiers in the style of {0}, {1}... to be replaced.
//   return haystack.replace(/{(\d+)}/g, (match, n) => {
//     return (typeof arguments[n+1] !== 'undefined') ? arguments[n+1] : match;
//   });
// }


/**
 * Slugifies a string, converting it to lower case and replacing all special
 * characters (besides umlauts!) and spaces with dashes.
 *
 * @param  {string} str
 * @return {string}
 */
export function slugify(str) {
  return umlauts2digraphs(str).toLowerCase().replace(/[^\wüöä]+/ig, '-');
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
  const trailingSlash = isBoolean(arguments[n]) ? arguments[n] : false;

  for (let i = 1; i < n; i++) {
    let next = arguments[i];

    // Remove leading/trailing slashes.
    while (startsWith(next, '/')) { next = next.slice(1); }
    while (endsWith(path, '/')) { path = path.slice(0, -1); }

    // Append to path.
    path += '/' + next;
  }

  // Remove all trailing and all but one leading slashes.
  while (endsWith(path, '/')) { path = path.slice(0, -1); }
  while (startsWith(path, '//')) { path = path.slice(1); }

  // Add a single trailing slash if requested.
  if ( trailingSlash && !endsWith(path, '/')) { path += '/'; }

  return path;
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


// /* global Intl */
// const { compare } = Intl ? new Intl.Collator('de')
//                          : { compare: (a, b) => a - b };
//
// const UMLAUTS = { 'ä': 'ae', 'ü': 'ue', 'ö': 'oe',
//                   'Ä': 'AE', 'Ü': 'UE', 'Ö': 'OE',
//                   'ß': 'ss' };

const UMLAUTS = { '\u00e4': 'ae', '\u00fc': 'ue', '\u00f6': 'oe',
                  '\u00c4': 'AE', '\u00dc': 'UE', '\u00d6': 'OE',
                  '\u00df':'ss' };

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
