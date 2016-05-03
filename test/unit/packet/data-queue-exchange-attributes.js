'use strict';

import { DataQueueExchangeAttributesRequest, DataQueueExchangeAttributesResponse } from '../../../src/packet/data-queue-exchange-attributes';

require('../../common');

describe('DataQueueExchangeAttributesRequest', () => {

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let p = new DataQueueExchangeAttributesRequest();
      p.length.should.equal(26);
      p.serviceId.should.equal(0xE007);
      p.templateLength.should.equal(6);
      p.clientVersion.should.equal(1);
      p.requestResponseId.should.equal(0);
      console.log(p.data.toString('hex'));
    });

  });

});

describe('DataQueueExchangeAttributesResponse', () => {

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let p = new DataQueueExchangeAttributesResponse();
      p.length.should.equal(22);
      p.serviceId.should.equal(0xE007);
      p.requestResponseId.should.equal(0x8000);
      console.log(p.data.toString('hex'));
    });

    it('should create from existing', () => {
      let p = new DataQueueExchangeAttributesResponse(new Buffer('000000160000e0070000000000000000000080000000', 'hex'));
      p.length.should.equal(22);
      p.serviceId.should.equal(0xE007);
      p.requestResponseId.should.equal(0x8000);
      console.log(p.data.toString('hex'));
    });

  });

});
