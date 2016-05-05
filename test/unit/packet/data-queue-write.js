'use strict';

import { DataQueueWriteRequest } from '../../../src/packet/data-queue-write';

require('../../common');

describe('DataQueueWriteRequest', () => {

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let p = new DataQueueWriteRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), null, new Buffer('DATA'));
      p.length.should.equal(52);
      p.templateLength.should.equal(22);
      p.serviceId.should.equal(0xE007);
      p.requestResponseId.should.equal(0x0005);
      p.entry.toString('hex').should.equal('44415441');
      p.name.toString('hex').should.equal('51554555450000000000');
      p.library.toString('hex').should.equal('4c494252415259000000');
      should.not.exist(p.key);
      console.log(p.data.toString('hex'));
      p = new DataQueueWriteRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'), new Buffer('KEY'), new Buffer('DATA'));
      p.length.should.equal(61);
      p.templateLength.should.equal(22);
      p.serviceId.should.equal(0xE007);
      p.requestResponseId.should.equal(0x0005);
      p.entry.toString('hex').should.equal('44415441');
      p.name.toString('hex').should.equal('51554555450000000000');
      p.library.toString('hex').should.equal('4c494252415259000000');
      p.key.toString('hex').should.equal('4b4559');
      console.log(p.data.toString('hex'));
    });

  });

});
