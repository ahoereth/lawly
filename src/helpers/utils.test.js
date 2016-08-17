import { expect } from 'chai';

import {
  isNumeric,
  obj2query,
  slugify,
  joinPath,
  parseJWT,
  umlauts2digraphs,
  localeCompare,
} from './utils';


describe('utils', () => {
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

  describe('obj2query', () => {
    it('encodes special characters in keys and values', () => {
      expect(obj2query({ m: 'a@b.', ü: 'ue' })).to.equal('m=a%40b.&%C3%BC=ue');
    });

    it('handles boolean values correctly', () => {
      expect(obj2query({ a: true, b: false })).to.equal('a&b=0');
    });
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
