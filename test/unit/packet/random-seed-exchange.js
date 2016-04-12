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
