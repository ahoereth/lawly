import { expect } from 'chai';
import { b64decode } from './base64';

describe('base64', () => {
  describe('b64decode', () => {
    it('decodes correctly', () => {
      expect(b64decode('YQ===')).to.equal('a');
      expect(b64decode('4pyTIMOgIGxhIG1vZGU=')).to.equal('✓ à la mode');
    });
  });
});
