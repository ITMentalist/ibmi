'use strict';

import { SignonSeedExchangeRequest, SignonSeedExchangeResponse } from '../../../src/packet/signon-seed-exchange';

require('../../common');

describe('SignonSeedExchangeRequest', () => {

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let p = new SignonSeedExchangeRequest();
      p.length.should.equal(52);
      p.serviceId.should.equal(0xE009);
      p.requestResponseId.should.equal(0x7003);
      p.templateLength.should.equal(0);
      p.clientId.should.equal(1);
      p.clientDataStreamLevel.should.equal(5);
      p.clientSeed.should.be.instanceOf(Buffer);
      p.clientSeed.length.should.equal(8);
    });

  });

});

describe('SignonSeedExchangeResponse', () => {

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let p = new SignonSeedExchangeResponse();
      let expectedSeed = new Buffer(8);
      expectedSeed.fill(0);
      let expectedJob = new Buffer(25);
      expectedJob.fill(0);
      p.rc.should.equal(0);
      p.rc = 1;
      p.rc.should.equal(1);
      p.length.should.equal(94);
      p.templateLength.should.equal(4);
      p.requestResponseId.should.equal(0xF003);
      p.serviceId.should.equal(0xE009);
      p.serverVersion.should.equal(0);
      p.serverVersion = 7340544;
      p.serverVersion.should.equal(7340544);
      p.serverLevel.should.equal(0);
      p.serverLevel = 10;
      p.serverLevel.should.equal(10);
      p.passwordLevel.should.equal(0);
      p.passwordLevel = 1;
      p.passwordLevel.should.equal(1);
      expect(p.serverSeed.equals(expectedSeed)).to.equal(true);
      expectedSeed[0] = 0xFF;
      p.serverSeed = expectedSeed
      expect(p.serverSeed.equals(expectedSeed)).to.equal(true);
      expect(p.jobName.equals(expectedJob)).to.equal(true);
      expectedJob[0] = 0xFF;
      p.jobName = expectedJob;
      expect(p.jobName.equals(expectedJob)).to.equal(true);
    });

    it('should create instance from data', () => {
      let b = new Buffer('0000005e0000e00900000000000000000004f003000000010000000a110100700200000000081102000a0000000e1103ff00000000000000000000071119010000001f111fff000000000000000000000000000000000000000000000000',
                         'hex');
      let p = new SignonSeedExchangeResponse(b);
      p.rc.should.equal(1);
      p.length.should.equal(94);
      p.templateLength.should.equal(4);
      p.requestResponseId.should.equal(0xF003);
      p.serviceId.should.equal(0xE009);
      p.serverVersion.should.equal(7340544);
      p.serverLevel.should.equal(10);
      p.passwordLevel.should.equal(1);
    });

  });

});
