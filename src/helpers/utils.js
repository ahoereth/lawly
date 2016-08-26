import { b64decode } from './base64';
import { isBoolean, endsWith } from 'lodash';


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
 * Encodes a JavaScript object into a url query string of key=value pairs
 * delimited with &.
 *
 * @param  {object} obj
 * @return {string}
 */
export function obj2query(obj = null, seperator = false) {
  if (!obj) { return ''; }
  const str = Object.keys(obj).map(key => {
    if (isBoolean(obj[key])) {
      return encodeURIComponent(key) + (obj[key] === false ? '=0' : '');
    }
    return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
  }).join('&');

  if (!seperator && str.indexOf('?') > -1) {
    return str.slice(1);
  } else if (seperator && str.indexOf('?') < 0) {
    return `?${str}`;
  }

  return str;
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
  const leadingSlash = parts[0].indexOf('/') === 0;
  if (isBoolean(parts[parts.length - 1])) {
    trailingSlash = parts[parts.length - 1];
    parts = parts.slice(0, -1);
  }

  const path = parts.map(part => {
    let clean = part;
    while (clean.indexOf('/') === 0) { clean = clean.slice(1); }
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
  const slug = umlauts2digraphs(str).toLowerCase()
    .replace(/[^\w]+/ig, '-') // Get rid of none word characters.
    .replace(/^-+|-+$/g, ''); // Get rid of dashes at the beginning and end.
  return encodeURIComponent(slug);
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
