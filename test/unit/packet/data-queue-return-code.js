'use strict';

import DataQueueReturnCodeResponse from '../../../src/packet/data-queue-return-code';

require('../../common');

describe('DataQueueReturnCode', () => {

  it('should create new instance', () => {
    let p = new DataQueueReturnCodeResponse();
    p.length.should.equal(22);
    p.serviceId.should.equal(0xE007);
    p.requestResponseId.should.equal(0x8002);
    p.rc.should.equal(0);
    should.not.exist(p.message);
    console.log(p.data.toString('hex'));
    p.rc = 1;
    p.rc.should.equal(1);
    p.message = new Buffer('AABBCCDD', 'hex');
    p.serviceId.should.equal(0xE007);
    p.requestResponseId.should.equal(0x8002);
    p.rc.should.equal(1);
    p.length.should.equal(32);
    p.message.toString('hex').should.equal('aabbccdd');
    console.log(p.data.toString('hex'));
  });

  it('should create instance from data', () => {
    let b = new Buffer('000000140000e0070000000000000000000080020001', 'hex');
    let p = new DataQueueReturnCodeResponse(b);
    p.length.should.equal(22);
    p.serviceId.should.equal(0xE007);
    p.requestResponseId.should.equal(0x8002);
    p.rc.should.equal(1);
    should.not.exist(p.message);
    console.log(p.data.toString('hex'));
    b = new Buffer('000000140000e00700000000000000000000800200010000000A0000AABBCCDD', 'hex');
    p = new DataQueueReturnCodeResponse(b);
    p.length.should.equal(32);
    p.message.toString('hex').should.equal('aabbccdd');
    console.log(p.data.toString('hex'));
  });

});
