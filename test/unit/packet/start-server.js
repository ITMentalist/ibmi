'use strict';

import { StartServerRequest, StartServerResponse } from '../../../src/packet/start-server';

require('../../common');

describe('StartServerRequest', () => {

  describe('#constructor()', () => {

    it('should fail due to invalid parameters', () => {
      expect(() => {return new StartServerRequest();}).to.throw(/Invalid user ID/);
      expect(() => {return new StartServerRequest('USER');}).to.throw(/Invalid encrypted password/);
      expect(() => {return new StartServerRequest('USER', new Buffer(10));}).to.throw(/Invalid service ID/);
    });

    it('should create new instance', () => {
      var password = new Buffer(8);
      var expectedUser = new Buffer([0xE3, 0xC5, 0xE2, 0XE3, 0xE4, 0xE2, 0xC5, 0xD9, 0x40, 0x40]);
      password.fill(0xEE);
      let p = new StartServerRequest('TESTUSER', password, 0xE002);
      p.length.should.equal(52);
      p.templateLength.should.equal(2);
      p.serviceId.should.equal(0xE002);
      p.requestResponseId.should.equal(0x7002);
      p.clientAttributes.should.equal(2);
      p.authType.should.equal(1);
      p.sendReply.should.equal(1);
      expect(p.password.equals(password)).to.equal(true);
      p.userId.should.equal('TESTUSER');
    });

  });

});

describe('StartServerResponse', () => {

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let p = new StartServerResponse();
      p.length.should.equal(71);
      p.templateLength.should.equal(4);
      p.requestResponseId.should.equal(0xF002);
      p.rc.should.equal(0);
      p.rc = 1;
      p.rc.should.equal(1);
      p.userId = 'TESTUSER';
      p.userId.should.equal('TESTUSER');
      p.jobName = new Buffer('JOB');
      should.exist(p.jobName);
    });

    it('should create from existing', () => {
      let p = new StartServerResponse(new Buffer('000000470000000000000000000000000004f00200000000000000101104e3c5e2e3e4e2c5d940400000001f111f4a4f4200000000000000000000000000000000000000000000', 'hex'));
      p.length.should.equal(71);
      p.templateLength.should.equal(4);
      p.requestResponseId.should.equal(0xF002);
      p.userId.should.equal('TESTUSER');
    });

  });

});
