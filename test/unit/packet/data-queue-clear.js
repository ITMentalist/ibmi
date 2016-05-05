'use strict';

import { DataQueueClearRequest } from '../../../src/packet/data-queue-clear';

require('../../common');

describe('DataQueueClearRequest', () => {

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let p = new DataQueueClearRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), null);
      p.length.should.equal(41);
      p.templateLength.should.equal(21);
      p.serviceId.should.equal(0xE007);
      p.requestResponseId.should.equal(0x0006);
      p.name.toString('hex').should.equal('51554555450000000000');
      p.library.toString('hex').should.equal('4c494252415259000000');
      should.not.exist(p.key);
      console.log(p.data.toString('hex'));
      p = new DataQueueClearRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), new Buffer('KEY'));
      p.length.should.equal(50);
      p.templateLength.should.equal(21);
      p.serviceId.should.equal(0xE007);
      p.requestResponseId.should.equal(0x0006);
      p.name.toString('hex').should.equal('51554555450000000000');
      p.library.toString('hex').should.equal('4c494252415259000000');
      p.key.toString('hex').should.equal('4b4559');
      console.log(p.data.toString('hex'));
    });

  });

});
