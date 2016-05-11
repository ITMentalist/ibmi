'use strict';

import { DataQueueReadRequest, DataQueueReadResponse } from '../../../src/packet/data-queue-read';

require('../../common');

describe('DataQueueReadRequest', () => {

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let p = new DataQueueReadRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), null, 0, false, null);
      p.length.should.equal(48);
      p.templateLength.should.equal(28);
      p.serviceId.should.equal(0xE007);
      p.requestResponseId.should.equal(0x0002);
      p.name.toString('hex').should.equal('51554555450000000000');
      p.library.toString('hex').should.equal('4c494252415259000000');
      p.wait.should.equal(0);
      p.peek.should.equal(0xF0);
      p.search.toString('hex').should.equal('0000');
      should.not.exist(p.key);
      console.log(p.data.toString('hex'));
      p = new DataQueueReadRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), new Buffer('**'), 10, true, new Buffer('KEY'));
      p.length.should.equal(57);
      p.templateLength.should.equal(28);
      p.serviceId.should.equal(0xE007);
      p.requestResponseId.should.equal(0x0002);
      p.name.toString('hex').should.equal('51554555450000000000');
      p.library.toString('hex').should.equal('4c494252415259000000');
      p.wait.should.equal(10);
      p.peek.should.equal(0xF1);
      p.search.toString('hex').should.equal('2a2a');
      p.key.toString('hex').should.equal('4b4559');
      console.log(p.data.toString('hex'));
    });

  });

});

describe('DataQueueReadResponse', () => {

  it('should create new instance', () => {
    let p = new DataQueueReadResponse();
    p.length.should.equal(58);
    p.templateLength.should.equal(38);
    p.serviceId.should.equal(0xE007);
    p.requestResponseId.should.equal(0x8003);
    p.senderInfo.toString('hex').should.equal('000000000000000000000000000000000000000000000000000000000000000000000000');
    let sender = new Buffer(36);
    sender.fill(0xFF);
    p.senderInfo = sender;
    p.senderInfo.toString('hex').should.equal('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    let entry = new Buffer('ENTRY');
    p.entry = entry;
    p.entry.toString().should.equal('ENTRY');
    let key = new Buffer('KEY');
    p.key = key;
    p.key.toString().should.equal('KEY');
    p.length.should.equal(78);
    console.log(p.data.toString('hex'));
  });

  it('should create from existing', () => {
    let p = new DataQueueReadResponse(new Buffer('0000004e0000e0070000000000000000002680030000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000b5002454e5452590000000950034b4559', 'hex'));
    p.templateLength.should.equal(38);
    p.serviceId.should.equal(0xE007);
    p.requestResponseId.should.equal(0x8003);
    p.senderInfo.toString('hex').should.equal('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    p.length.should.equal(78);
    p.entry.toString().should.equal('ENTRY');
    p.key.toString().should.equal('KEY');
    console.log(p.data.toString('hex'));
  });

});
