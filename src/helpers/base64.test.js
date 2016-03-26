import chai from 'chai';
chai.should();

import {
  b64decode,
} from './base64';


describe('helpers', () => {
  describe('base64', () => {
    describe('b64decode', () => {
      it('decodes correctly', () => {
        b64decode('YQ===').should.equal('a');
        b64decode('4pyTIMOgIGxhIG1vZGU=').should.equal('✓ à la mode');
      });
    });
  });
});
