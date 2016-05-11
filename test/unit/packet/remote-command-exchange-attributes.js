'use strict';

import { RemoteCommandExchangeAttributesRequest, RemoteCommandExchangeAttributesResponse } from '../../../src/packet/remote-command-exchange-attributes';

require('../../common');

describe('RemoteCommandExchangeAttributesRequest', () => {

  describe('#constructor()', () => {

    it('should fail due to invalid parameters', () => {
      expect(() => {return new RemoteCommandExchangeAttributesRequest();}).to.throw(/Invalid NLV/);
    });

    it('should create new instance', () => {
      let p = new RemoteCommandExchangeAttributesRequest('1234');
      p.length.should.equal(34);
      p.serviceId.should.equal(0xE008);
      p.requestResponseId.should.equal(0x1001);
      p.templateLength.should.equal(14);
      p.ccsid.should.equal(37);
      p.nlv.should.equal(4059231220);
      p.clientVersion.should.equal(1);
    });

  });

});

describe('RemoteCommandExchangeAttributesResponse', () => {

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let p = new RemoteCommandExchangeAttributesResponse();
      p.length.should.equal(36);
      p.serviceId.should.equal(0xE008);
      p.requestResponseId.should.equal(0x8001);
      p.rc.should.equal(0);
      p.ccsid.should.equal(0);
      p.ccsid = 1;
      p.ccsid.should.equal(1);
      p.dsLevel.should.equal(0);
      p.dsLevel = 1;
      p.dsLevel.should.equal(1);
    });

    it('should create from existing', () => {
      let p = new RemoteCommandExchangeAttributesResponse(new Buffer('000000240000e008000000000000d28000108001010000000025f2f9f2f400070200000b', 'hex'));
      p.length.should.equal(36);
      p.serviceId.should.equal(0xE008);
      p.requestResponseId.should.equal(0x8001);
      p.rc.should.equal(256);
      p.ccsid.should.equal(37);
      p.ccsid = 1;
      p.ccsid.should.equal(1);
      p.dsLevel.should.equal(11);
      p.dsLevel = 1;
      p.dsLevel.should.equal(1);
    });

  });

});
