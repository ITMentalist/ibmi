'use strict';

import { SignonInfoRequest, SignonInfoResponse } from '../../../src/packet/signon-info';

require('../../common');

describe('SignonInfoRequest', () => {

  describe('#constructor()', () => {

    it('should fail due to invalid parameters', () => {
      expect(() => {return new SignonInfoRequest();}).to.throw(/Invalid user ID/);
      expect(() => {return new SignonInfoRequest('USER');}).to.throw(/Invalid encrypted password/);
      expect(() => {return new SignonInfoRequest('USER', new Buffer(10));}).to.throw(/Invalid server level/);
    });

    it('should create new instance', () => {
      var password = new Buffer(8);
      var expectedUser = new Buffer([0xE3, 0xC5, 0xE2, 0XE3, 0xE4, 0xE2, 0xC5, 0xD9, 0x40, 0x40]);
      password.fill(0xEE);
      let p = new SignonInfoRequest('TESTUSER', password, 10);
      p.length.should.equal(68);
      p.serviceId.should.equal(0xE009);
      p.requestResponseId.should.equal(0x7004);
      p.templateLength.should.equal(1);
      p.authenticationScheme.should.equal(1);
      p.clientCCSID.should.equal(1200);
      expect(p.password.equals(password)).to.equal(true);
      p.userId.should.equal('TESTUSER');
      p.returnErrorMessages.should.equal(1);
      p = new SignonInfoRequest('TESTUSER', password, 2);
      p.returnErrorMessages.should.equal(0);
    });

  });

});

describe('SignonInfoResponse', () => {

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let p = new SignonInfoResponse();
      p.length.should.equal(147);
      p.rc.should.equal(0);
      p.templateLength.should.equal(4);
      p.requestResponseId.should.equal(0xF004);
      p.serviceId.should.equal(0xE009);
      p.currentSignonDate.should.be.instanceof(Date);
      p.currentSignonDate = new Date();
      p.currentSignonDate.should.be.instanceof(Date);
      p.lastSignonDate.should.be.instanceof(Date);
      p.lastSignonDate = new Date();
      p.lastSignonDate.should.be.instanceof(Date);
      p.passwordExpirationDate.should.be.instanceof(Date);
      p.passwordExpirationDate = new Date();
      p.passwordExpirationDate.should.be.instanceof(Date);
      p.expirationWarning.should.equal(0);
      p.expirationWarning = 7;
      p.expirationWarning.should.equal(7);
      p.serverCCSID.should.equal(0);
      p.serverCCSID = 37;
      p.serverCCSID.should.equal(37);
      p.userId.should.equal('');
      p.userId = 'TEST';
      p.userId.should.equal('TEST');
    });

    it('should create from exiting', () => {
      let p = new SignonInfoResponse(new Buffer('000000750000e00900000000000000000004f004000000000000000e110607df071c0b1f31000000000e110707df071c0b1e0100000000081109000000000008110a000300000007110ef30000000a112c000000070000000e110be08d2a9576e799150000000a11140000002500000008112a00000000000000000000000000000000', 'hex'));
      p.rc.should.equal(0);
      p.rc = 1;
      p.rc.should.equal(1);
      p.currentSignonDate.should.be.instanceof(Date);
      p.currentSignonDate = new Date();
      p.currentSignonDate.should.be.instanceof(Date);
      p.lastSignonDate.should.be.instanceof(Date);
      p.lastSignonDate = new Date();
      p.lastSignonDate.should.be.instanceof(Date);
      expect(p.passwordExpirationDate).to.equal(null);
      p.passwordExpirationDate = new Date();
      p.passwordExpirationDate.should.be.instanceof(Date);
      p.expirationWarning.should.equal(7);
      p.expirationWarning = 8;
      p.expirationWarning.should.equal(8);
      p.serverCCSID.should.equal(37);
      p.serverCCSID = 38;
      p.serverCCSID.should.equal(38);
      expect(p.userId).to.equal(null);
    });

  });

});
