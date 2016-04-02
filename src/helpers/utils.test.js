import chai from 'chai';
chai.should();

import {
  isObject,
  isString,
  startsWith,
  endsWith,
  arr2obj,
  obj2arr,
  obj2query,
  omit,
  slugify,
  joinPath,
  parseJWT,
  umlauts2digraphs,
  localeCompare
} from './utils';


describe('utils', () => {
  describe('isObject', () => {
    it('plain objects are objects', () => {
      isObject({}).should.be.true;
      isObject({ a: '1', b: '2' }).should.be.true;
      isObject(Object.create(null)).should.be.true;
      isObject(Object.create([])).should.be.true;
    });

    it('arrays are no objects', () => {
      isObject([]).should.be.false;
      isObject([ { a: 1, b: 2 } ]).should.be.false;
    });

    it('functions are no objects', () => {
      isObject(() => {}).should.be.false;
      isObject(isObject).should.be.false;
      isObject(Function).should.be.false;
    });

    it('nothing else is an object', () => {
      isObject(null).should.be.false;
      isObject(3).should.be.false;
      isObject(new Number(7)).should.be.false;
      isObject('somestring').should.be.false;
      isObject(new Date()).should.be.false;
    });
  });

  describe('isString', () => {
    it('strings are strings', () => {
      isString('some string').should.be.true;
      isString(new String('another string')).should.be.true;
    });

    it('nothing else is a string', () => {
      isString([ 'a', 'r' ]).should.be.false;
      isString({ r: 'a', y: '!' }).should.be.false;
      isString(123).should.be.false;
      isString(() => {}).should.be.false;
      isString(null).should.be.false;
    });
  });

  describe('startsWith', () => {
    it('detects string starts correctly', () => {
      startsWith('abc', 'a').should.be.true;
      startsWith('abc', 'ab').should.be.true;
      startsWith('abc', 'abc').should.be.true;
      startsWith('abc', 'bc').should.not.be.true;
    });
  });

  describe('endsWith', () => {
    it('detects string ends correctly', () => {
      endsWith('abc', 'c').should.be.true;
      endsWith('abc', 'bc').should.be.true;
      endsWith('abc', 'abc').should.be.true;
      endsWith('acbc', 'c').should.be.true;
      endsWith('abc', 'ab').should.not.be.true;
    });
  });

  const o2a = {
    c: {a: 'c', b: 'x'},
    b: {a: 'b', b: 'y'},
    a: {a: 'a', b: 'z'},
  };

  const a2o = [
    {a: 'c', b: 'x'},
    {a: 'b', b: 'y'},
    {a: 'a', b: 'z'}
  ];

  describe('arr2obj', () => {
    it('converts arrays to objects', () => {
      arr2obj(a2o, 'a').should.deep.equal(o2a);
    });
  });

  describe('obj2arr', () => {
    it('converts objects to arrays', () => {
      obj2arr(o2a).should.deep.equal(a2o);
    });
  });

  describe('obj2query', () => {
    it('encodes special characters in keys and values', () => {
      obj2query({ m: 'a@b.c', ü: 'ue' }).should.equal('m=a%40b.c&%C3%BC=ue');
    });

    it('handles boolean values correctly', () => {
      obj2query({ a: true, b: false }).should.equal('a&b=0');
    });
  });

  describe('omit', () => {
    it('removes object values as expected by key', () => {
      omit({ a: 1, b: 2, c: 3 }, 'c', 'b').should.have.keys('a');
      omit({ a: 1, b: 2 }, 'd', 'b').should.have.keys('a');
    });

    it('does not alter the source object', () => {
      let obj = { a: 1, b: 2 };
      omit(obj, 'b').should.deep.equal({ a: 1 });
      obj.should.deep.equal({ a: 1, b: 2 });
    });

    it('removes array values as expected by value', () => {
      omit(['some value'], 'some value').should.deep.equal([]);
      omit(['some value'], 'woop').should.deep.equal(['some value']);
      omit([1, 2], 2).should.deep.equal([1]);
      omit([1, 2], 4, 1).should.deep.equal([2]);
      omit([1, 2, 3], 1, 2).should.deep.equal([3]);
    });
  });

  describe('slugify', () => {
    it('gets rid of whitespace and stuff', () => {
      slugify('a $$%&/()   b_c d').should.equal('a-b_c-d');
    });

    it('converts umlauts to their 2 character equivalents', () => {
      slugify('äüßö').should.equal('aeuessoe');
    });

    it('converts everything to lower case', () => {
      slugify('ABÄ').should.equal('abae');
    });
  });

  describe('joinPath', () => {
    it('joins paths', () => {
      joinPath('///a/b/c', '///d///', '/e/').should.equal('/a/b/c/d/e');
      joinPath('/a/b/c', 'd', 'e').should.equal('/a/b/c/d/e');
    });

    it('removes trailing slashes', () => {
      joinPath('a', 'b', '/').should.equal('a/b');
      joinPath('a', 'b/', '/').should.equal('a/b');
      joinPath('a', 'b/').should.equal('a/b');
    });

    it('keeps, adds or adjusts trailing slashes if requested', () => {
      joinPath('a', 'b', true).should.equal('a/b/');
      joinPath('a', 'b/', true).should.equal('a/b/');
      joinPath('a', 'b', '/', true).should.equal('a/b/');
      joinPath('a', 'b//', '/', true).should.equal('a/b/');
    });
  });

  describe('parseJWT', () => {
    it('decodes a JWT token correctly', () => {
      /* global window */
      const obj2b64 = obj => window.btoa(JSON.stringify(obj));

      const head = { header: 'header content' };
      const load = { payload: 'payload content' };
      const token = obj2b64(head) + '.' + obj2b64(load) + '.' + 'signature';
      const { header, payload } = parseJWT(token);

      header.should.deep.equal(head);
      payload.should.deep.equal(load);
    });
  });

  describe('umlauts2digraphs', () => {
    it('converts umlauts to their corresponding 2 letter version', () => {
      umlauts2digraphs('äÄüÜöÖß').should.equal('aeAEueUEoeOEss');
    });
  });

  describe('localeCompare', () => {
    it('correctly ranks characters', () => {
      const arr = ['d', 'a', 'c', 'g', 'e', 'f', 'b'].sort(localeCompare);
      arr.should.eql(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    });

    it('correctly handles umlauts', () => {
      const arr = ['ä', 'Ü', 'd', 'a', 'aa', 'c', 'ü'].sort(localeCompare);
      arr.should.eql(['a', 'aa', 'ä', 'c', 'd', 'Ü', 'ü']);
    });

    it('is case insensitive', () => {
      const arr = ['ä', 'd', 'A', 'aa', 'c', 'ü', 'Ü'].sort(localeCompare);
      arr.should.eql(['A', 'aa', 'ä', 'c', 'd', 'ü', 'Ü']);
      arr.should.not.eql(['A', 'aa', 'ä', 'c', 'd', 'Ü', 'ü']);
    });
  });
});
