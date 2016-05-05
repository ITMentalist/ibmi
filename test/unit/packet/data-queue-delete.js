'use strict';

import { DataQueueDeleteRequest } from '../../../src/packet/data-queue-delete';

require('../../common');

describe('DataQueueDeleteRequest', () => {

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let p = new DataQueueDeleteRequest(new Buffer('QUEUE'), new Buffer('LIBRARY'));
      p.length.should.equal(40);
      p.templateLength.should.equal(20);
      p.serviceId.should.equal(0xE007);
      p.requestResponseId.should.equal(0x0004);
      p.name.toString('hex').should.equal('51554555450000000000');
      p.library.toString('hex').should.equal('4c494252415259000000');
      console.log(p.data.toString('hex'));
    });

  });

});
