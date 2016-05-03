'use strict';

import { RandomSeedExchangeRequest, RandomSeedExchangeResponse } from '../../../src/packet/random-seed-exchange';

require('../../common');

describe('RandomSeedExchangeRequest', () => {

  describe('#constructor()', () => {

    it('should fail due to invalid parameters', () => {
      expect(() => {return new RandomSeedExchangeRequest();}).to.throw(/Invalid service ID/);
      expect(() => {return new RandomSeedExchangeRequest('123');}).to.throw(/Invalid service ID/);
    });

    it('should create new instance', () => {
      let p = new RandomSeedExchangeRequest(0xE002);
      p.length.should.equal(28);
      p.serviceId.should.equal(0xE002);
      p.clientAttributes.should.equal(1);
      p.templateLength.should.equal(8);
      p.requestResponseId.should.equal(0x7001);
      p.seed.should.be.instanceOf(Buffer);
      p.seed.length.should.equal(8);
    });

  });

});

describe('RandomSeedExchangeResponse', () => {

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let p = new RandomSeedExchangeResponse();
      let expectedSeed = new Buffer(8);
      expectedSeed.fill(0);
      p.rc.should.equal(0);
      p.rc = 1;
      p.rc.should.equal(1);
      p.length.should.equal(32);
      p.requestResponseId.should.equal(0xF001);
      expect(p.seed.equals(expectedSeed)).to.equal(true);
      expectedSeed[0] = 0xFF;
      p.seed = expectedSeed
      expect(p.seed.equals(expectedSeed)).to.equal(true);
    });

    it('should create instance from data', () => {
      let b = new Buffer('000000200000000000000000000000000008f001000000000000000000000000', 'hex');
      let p =  new RandomSeedExchangeResponse(b);
      let expectedSeed = new Buffer(8);
      expectedSeed.fill(0);
      p.rc.should.equal(0);
      p.rc = 1;
      p.rc.should.equal(1);
      p.length.should.equal(32);
      p.requestResponseId.should.equal(0xF001);
      expect(p.seed.equals(expectedSeed)).to.equal(true);
      expectedSeed[0] = 0xFF;
      p.seed = expectedSeed
      expect(p.seed.equals(expectedSeed)).to.equal(true);
    });

  });

});
