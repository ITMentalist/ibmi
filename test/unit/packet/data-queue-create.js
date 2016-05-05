'use strict';

import { DataQueueCreateRequest } from '../../../src/packet/data-queue-create';

require('../../common');

describe('DataQueueCreateRequest', () => {

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let p = new DataQueueCreateRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), 50, '*ALL', true, true, 0, false, new Buffer('Some description'));
      p.length.should.equal(100);
      p.templateLength.should.equal(80);
      p.serviceId.should.equal(0xE007);
      p.requestResponseId.should.equal(0x0003);
      p.name.toString('hex').should.equal('51554555450000000000');
      p.library.toString('hex').should.equal('4c494252415259000000');
      p.entryLength.should.equal(50);
      p.authority.should.equal(0xF0);
      p.saveSenderInfo.should.equal(0xF1);
      p.type.should.equal(0xF0);
      p.keyLength.should.equal(0);
      p.forceStorage.should.equal(0xF0);
      p.description.toString('hex').should.equal('536f6d65206465736372697074696f6e00000000000000000000000000000000000000000000000000000000000000000000');
      console.log(p.data.toString('hex'));
      p = new DataQueueCreateRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), 50, '*LIBCRTAUT', true, true, 0, false, new Buffer('Some description'));
      p.authority.should.equal(0xF4);
      p = new DataQueueCreateRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), 50, '*CHANGE', true, true, 0, false, new Buffer('Some description'));
      p.authority.should.equal(0xF1);
      p = new DataQueueCreateRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), 50, '*EXCLUDE', true, true, 0, false, new Buffer('Some description'));
      p.authority.should.equal(0xF2);
      p = new DataQueueCreateRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), 50, '*USE', true, true, 0, false, new Buffer('Some description'));
      p.authority.should.equal(0xF3);
      p = new DataQueueCreateRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), 50, '*ALL', true, false, 0, false, new Buffer('Some description'));
      p.type.should.equal(0xF1);
      p = new DataQueueCreateRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), 50, '*ALL', true, false, 25, false, new Buffer('Some description'));
      p.type.should.equal(0xF2);
      p.keyLength.should.equal(25);
      p = new DataQueueCreateRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), 50, '*ALL', true, true, 0, true, new Buffer('Some description'));
      p.forceStorage.should.equal(0xF1);
      p = new DataQueueCreateRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), 50, '*ALL', false, true, 0, false, new Buffer('Some description'));
      p.saveSenderInfo.should.equal(0xF0);
    });

  });

});
