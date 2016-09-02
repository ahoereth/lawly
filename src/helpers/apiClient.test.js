import chai, { expect } from 'chai';
import spies from 'chai-spies';

import ApiClient from './ApiClient';


chai.use(spies);


describe('ApiClient', () => {
  const client = new ApiClient('apiurl');
  let tmp;

  // it('provides fetch()', () => {
  //
  // });

  it('provides get() for GET', () => {
    client.fetch = chai.spy(f => { tmp = f; });
    client.get({ name: 'none' });
    expect(client.fetch).to.be.called.once;
    expect(tmp).to.have.property('method', 'get');
  });

  it('provides post() for POST', () => {
    client.fetch = chai.spy(f => { tmp = f; });
    client.post({ name: 'none' });
    expect(client.fetch).to.be.called.once;
    expect(tmp).to.have.property('method', 'post');
  });

  it('provides put() for PUT', () => {
    client.fetch = chai.spy(f => { tmp = f; });
    client.put({ name: 'none' });
    expect(client.fetch).to.be.called.once;
    expect(tmp).to.have.property('method', 'put');
  });

  // auth
  // unauth
  // search

  it('provides remove() for DELETE', () => {
    client.fetch = chai.spy(f => { tmp = f; });
    client.remove({ name: 'none' });
    expect(client.fetch).to.be.called.once;
    expect(tmp).to.have.property('method', 'delete');
  });

  it('provides setAuthToken()', () => {
    const auth = client.storage.auth;
    client.storage.auth = chai.spy(f => f);
    client.setAuthToken('token');
    expect(client.headers.authorization).to.equal('JWT token');
    expect(client.storage.auth).to.be.called.once;
    client.storage.auth = auth;
  });

  describe('parseFetchOptions()', () => {
    it('it passes params through and has defaults', () => {
      const req = { method: 'post', name: 'test', action: 'reduxaction' };
      const { method, name, action, cachable } = client.parseFetchOptions(req);
      expect(method).to.equal('post');
      expect(name).to.equal('test');
      expect(action).to.equal('reduxaction');
      expect(cachable).to.be.false;
      const req2 = client.parseFetchOptions({ ...req, cachable: true });
      expect(req2.cachable).to.be.true;
    });

    it('it handles POST correctly', () => {
      ApiClient.resources.test = '/test/url/:data1';
      const req = { method: 'post', name: 'test', data1: 'a', data2: 'b' };
      const { method, url, body } = client.parseFetchOptions(req);
      expect(method).to.equal('post');
      expect(url).to.match(/\/test\/url\/a$/);
      expect(body).to.deep.equal({ data2: 'b' });
    });

    it('it handles GET correctly', () => {
      ApiClient.resources.test = '/test/url/:data1';
      const req = { method: 'get', name: 'test', data1: 'a', data2: 'b' };
      const { method, url, body } = client.parseFetchOptions(req);
      expect(method).to.equal('get');
      expect(url).to.match(/\/test\/url\/a\?data2=b$/);
      expect(body).to.be.empty;
    });
  });

  // describe('parseResponse()', () => {
  //
  // });
});
