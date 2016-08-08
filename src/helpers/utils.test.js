import { expect } from 'chai';

import {
  isString,
  isObject,
  isUndefined,
  isBoolean,
  isNumeric,
  startsWith,
  endsWith,
  toInt,
  arr2obj,
  obj2arr,
  obj2query,
  pick,
  omit,
  slugify,
  joinPath,
  parseJWT,
  umlauts2digraphs,
  localeCompare,
} from './utils';


describe('utils', () => {
  describe('isString', () => {
    it('strings are strings', () => {
      expect(isString('some string')).to.be.true;
      // eslint-disable-next-line no-new-wrappers
      expect(isString(new String('another string'))).to.be.true;
    });

    it('nothing else is a string', () => {
      expect(isString(['a', 'r'])).to.be.false;
      expect(isString({ r: 'a', y: '!' })).to.be.false;
      expect(isString(123)).to.be.false;
      expect(isString(() => {})).to.be.false;
      expect(isString(null)).to.be.false;
    });
  });

  describe('isObject', () => {
    it('plain objects are objects', () => {
      expect(isObject({})).to.be.true;
      expect(isObject({ a: '1', b: '2' })).to.be.true;
      expect(isObject(Object.create(null))).to.be.true;
      expect(isObject(Object.create([]))).to.be.true;
    });

    it('arrays are no objects', () => {
      expect(isObject([])).to.be.false;
      expect(isObject([{ a: 1, b: 2 }])).to.be.false;
    });

    it('functions are no objects', () => {
      expect(isObject(() => {})).to.be.false;
      expect(isObject(isObject)).to.be.false;
      expect(isObject(Function)).to.be.false;
    });

    it('nothing else is an object', () => {
      expect(isObject(null)).to.be.false;
      expect(isObject(3)).to.be.false;
      // eslint-disable-next-line no-new-wrappers
      expect(isObject(new Number(7))).to.be.false;
      expect(isObject('somestring')).to.be.false;
      expect(isObject(new Date())).to.be.false;
    });
  });

  describe('isUndefined', () => {
    it('detects undefined as undefined', () => {
      const x = undefined;
      let y;
      expect(isUndefined(undefined)).to.be.true;
      expect(isUndefined(x)).to.be.true;
      expect(isUndefined(y)).to.be.true;
    });

    it('detects that other stuff is not undefined', () => {
      expect(isUndefined(123)).to.be.false;
      expect(isUndefined('')).to.be.false;
      expect(isUndefined(null)).to.be.false;
      expect(isUndefined(() => {})).to.be.false;
    });
  });

  describe('isBoolean', () => {
    it('recognizes booleans as booleans', () => {
      expect(isBoolean(true)).to.be.true;
      expect(isBoolean(false)).to.be.true;
      expect(isBoolean(1)).to.be.false;
      expect(isBoolean(null)).to.be.false;
    });
  });

  describe('isNumeric', () => {
    it('recognizes numbers as numeric', () => {
      expect(isNumeric(123)).to.be.true;
      expect(isNumeric(-123)).to.be.true;
      expect(isNumeric(+123)).to.be.true;
    });

    it('recognizes number strings as numeric', () => {
      expect(isNumeric('123')).to.be.true;
      expect(isNumeric('-123')).to.be.true;
      expect(isNumeric('+123')).to.be.true;
      expect(isNumeric('0.123')).to.be.true;
      expect(isNumeric('-0.123')).to.be.true;
      expect(isNumeric('.123')).to.be.true;
      expect(isNumeric('-.123')).to.be.true;
      expect(isNumeric('1e100')).to.be.true;
      expect(isNumeric('1e-100')).to.be.true;
      expect(isNumeric('-1e-100')).to.be.true;
    });

    it('recognizes infinity as not numeric', () => { // should it?
      expect(isNumeric(Infinity)).to.be.false;
      expect(isNumeric(-Infinity)).to.be.false;
    });

    it('recognizes other strings as not numeric', () => {
      expect(isNumeric('abc')).to.be.false;
      expect(isNumeric('10%')).to.be.false;
      expect(isNumeric('#10')).to.be.false;
      expect(isNumeric('2^10')).to.be.false;
      expect(isNumeric('2!')).to.be.false;
      expect(isNumeric('(10)')).to.be.false;
      expect(isNumeric('10px')).to.be.false;
      expect(isNumeric('*')).to.be.false;
      expect(isNumeric('')).to.be.false;
    });

    it('recognizes booleans, arrays or raw objects as not numeric', () => {
      expect(isNumeric(true)).to.be.false;
      expect(isNumeric(false)).to.be.false;
      expect(isNumeric([])).to.be.false;
      expect(isNumeric({})).to.be.false;
    });

    it('recognizes functions, undefined or null as not numeric', () => {
      // eslint-disable-next-line prefer-arrow-callback
      expect(isNumeric(function () {})).to.be.false;
      expect(isNumeric(undefined)).to.be.false;
      expect(isNumeric(null)).to.be.false;
    });
  });

  describe('startsWith', () => {
    it('recognizes string starts correctly', () => {
      expect(startsWith('abc', 'a')).to.be.true;
      expect(startsWith('abc', 'ab')).to.be.true;
      expect(startsWith('abc', 'abc')).to.be.true;
      expect(startsWith('abc', 'bc')).to.be.false;
      expect(startsWith('abc', 'b')).to.be.false;
    });
  });

  describe('endsWith', () => {
    it('recognizes string ends correctly', () => {
      expect(endsWith('abc', 'c')).to.be.true;
      expect(endsWith('abc', 'bc')).to.be.true;
      expect(endsWith('abc', 'abc')).to.be.true;
      expect(endsWith('acbc', 'c')).to.be.true;
      expect(endsWith('abc', 'ab')).to.be.false;
      expect(endsWith('abc', 'b')).to.be.false;
    });
  });

  describe('toInt', () => {
    it('casts undefined, null and empty strings to zero', () => {
      expect(toInt(undefined)).to.equal(0);
      expect(toInt(null)).to.equal(0);
      expect(toInt('')).to.equal(0);
    });

    it('casts boolean true to one and false to zero', () => {
      expect(toInt(true)).to.equal(1);
      expect(toInt(false)).to.equal(0);
    });

    it('casts other isNumerics to their equivalent numbers', () => {
      expect(toInt('123')).to.equal(123);
      expect(toInt('-123')).to.equal(-123);
      expect(toInt('+123')).to.equal(123);
      expect(toInt('0.123')).to.equal(0);
      expect(toInt('-0.123')).to.equal(0);
      expect(toInt('.123')).to.equal(0);
      expect(toInt('-.123')).to.equal(0);
    });

    it('cannot handle #e## notation', () => {
      expect(toInt('1e100')).to.not.equal(1e100);
      expect(toInt('1e-100')).to.not.equal(1e-100);
      expect(toInt('-1e-100')).to.not.equal(-1e-100);
    });
  });

  const o2a = {
    c: { a: 'c', b: 'x' },
    b: { a: 'b', b: 'y' },
    a: { a: 'a', b: 'z' },
  };

  const a2o = [
    { a: 'c', b: 'x' },
    { a: 'b', b: 'y' },
    { a: 'a', b: 'z' },
  ];

  describe('arr2obj', () => {
    it('converts arrays to objects', () => {
      expect(arr2obj(a2o, 'a')).to.deep.equal(o2a);
    });
  });

  describe('obj2arr', () => {
    it('converts objects to arrays', () => {
      expect(obj2arr(o2a)).to.deep.equal(a2o);
    });
  });

  describe('obj2query', () => {
    it('encodes special characters in keys and values', () => {
      expect(obj2query({ m: 'a@b.', ü: 'ue' })).to.equal('m=a%40b.&%C3%BC=ue');
    });

    it('handles boolean values correctly', () => {
      expect(obj2query({ a: true, b: false })).to.equal('a&b=0');
    });
  });

  describe('omit', () => {
    it('omits object values by rest argument', () => {
      expect(omit({ a: 1, b: 2, c: 3 }, 'c', 'b')).to.have.keys('a');
      expect(omit({ a: 1, b: 2 }, 'd', 'b')).to.have.keys('a');
    });

    it('omits object values by array', () => {
      expect(omit({ a: 1, b: 2, c: 3 }, ['c', 'b'])).to.have.keys('a');
      expect(omit({ a: 1, b: 2 }, ['d', 'b'])).to.have.keys('a');
    });

    it('does not alter the source object', () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, 'b')).to.deep.equal({ a: 1 });
      expect(obj).to.deep.equal({ a: 1, b: 2 });
    });

    it('removes array values as expected by value', () => {
      expect(omit(['some value'], 'some value')).to.deep.equal([]);
      expect(omit(['some value'], 'woop')).to.deep.equal(['some value']);
      expect(omit([1, 2], 2)).to.deep.equal([1]);
      expect(omit([1, 2], 4, 1)).to.deep.equal([2]);
      expect(omit([1, 2, 3], 1, 2)).to.deep.equal([3]);
    });
  });

  describe('pick', () => {
    it('picks values by rest argument', () => {
      expect(pick({ a: 1, b: 2, c: 3 }, 'c', 'b')).to.have.keys('c', 'b');
      expect(pick({ a: 1, b: 2 }, 'd', 'b')).to.have.keys('b');
    });

    it('picks values by array', () => {
      expect(pick({ a: 1, b: 2, c: 3 }, ['c', 'b'])).to.have.keys('c', 'b');
      expect(pick({ a: 1, b: 2 }, ['d', 'b'])).to.have.keys('b');
    });

    it('does not alter the source object', () => {
      const obj = { a: 1, b: 2 };
      expect(pick(obj, 'b')).to.deep.equal({ b: 2 });
      expect(obj).to.deep.equal({ a: 1, b: 2 });
    });

    // Not implemented currently.
    // it('picks array values as expected by value', () => {
    //   expect(pick(['some value'], 'some value')).to.deep.equal(['some value']);
    //   expect(pick(['some value'], 'woop')).to.deep.equal([]);
    //   expect(pick([1, 2], 2)).to.deep.equal([2]);
    //   expect(pick([1, 2], 4, 1)).to.deep.equal([1]);
    //   expect(pick([1, 2, 3], 1, 2)).to.deep.equal([1, 2]);
    // });
  });

  describe('joinPath', () => {
    it('joins paths', () => {
      expect(joinPath('///a/b/c', '///d///', '/e/')).to.equal('/a/b/c/d/e');
      expect(joinPath('/a/b/c', 'd', 'e')).to.equal('/a/b/c/d/e');
    });

    it('removes trailing slashes', () => {
      expect(joinPath('a', 'b', '/')).to.equal('a/b');
      expect(joinPath('a', 'b/', '/')).to.equal('a/b');
      expect(joinPath('a', 'b/')).to.equal('a/b');
    });

    it('keeps, adds or adjusts trailing slashes if requested', () => {
      expect(joinPath('a', 'b', true)).to.equal('a/b/');
      expect(joinPath('a', 'b/', true)).to.equal('a/b/');
      expect(joinPath('a', 'b', '/', true)).to.equal('a/b/');
      expect(joinPath('a', 'b//', '/', true)).to.equal('a/b/');
    });
  });

  describe('parseJWT', () => {
    it('decodes a JWT token correctly', () => {
      /* global window */
      const obj2b64 = obj => window.btoa(JSON.stringify(obj));

      const head = { header: 'header content' };
      const load = { payload: 'payload content' };
      const token = `${obj2b64(head)}.${obj2b64(load)}.signature`;
      const { header, payload } = parseJWT(token);

      expect(header).to.deep.equal(head);
      expect(payload).to.deep.equal(load);
    });
  });

  describe('umlauts2digraphs', () => {
    it('converts umlauts to their corresponding 2 letter version', () => {
      expect(umlauts2digraphs('äÄüÜöÖß')).to.equal('aeAEueUEoeOEss');
    });
  });

  describe('slugify', () => {
    it('gets rid of whitespace and stuff', () => {
      expect(slugify('a $$%&/()   b_c d')).to.equal('a-b_c-d');
    });

    it('converts umlauts to their 2 character equivalents', () => {
      expect(slugify('äüßö')).to.equal('aeuessoe');
    });

    it('converts everything to lower case', () => {
      expect(slugify('ABÄ')).to.equal('abae');
    });

    it('Takes of dashes from the beginning and end', () => {
      expect(slugify('$ 123 Some Paragraph--')).to.equal('123-some-paragraph');
    });
  });

  describe('localeCompare', () => {
    it('correctly ranks characters', () => {
      const arr = ['d', 'a', 'c', 'g', 'e', 'f', 'b'].sort(localeCompare);
      expect(arr).to.eql(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    });

    it('correctly handles umlauts', () => {
      const arr = ['ä', 'Ü', 'd', 'a', 'aa', 'c', 'ü'].sort(localeCompare);
      expect(arr).to.eql(['a', 'aa', 'ä', 'c', 'd', 'Ü', 'ü']);
    });

    it('is case insensitive', () => {
      const arr = ['ä', 'd', 'A', 'aa', 'c', 'ü', 'Ü'].sort(localeCompare);
      expect(arr).to.eql(['A', 'aa', 'ä', 'c', 'd', 'ü', 'Ü']);
      expect(arr).to.not.eql(['A', 'aa', 'ä', 'c', 'd', 'Ü', 'ü']);
    });
  });
});
