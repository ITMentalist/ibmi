'use strict';

import DataQueueEntry from '../../../src/data-queue/data-queue-entry';
import Converter from '../../../src/types/converter';

require('../../common');

describe('DataQueueEntry', () => {

  let e;

  describe('#constructor()', () => {

    it('should create new instance', () => {
      let data = new Buffer('a2969485a2a399899587', 'hex');
      e = new DataQueueEntry(data, null, new Converter());
      e.data.toString('hex').should.equal('a2969485a2a399899587');
      e.senderInfo.should.equal('');
      should.exist(e.converter);
      e = new DataQueueEntry(data, new Buffer('DATA'), new Converter());
      e.senderInfo.toString().should.equal('DATA');
    });

  });

  describe('#toString()', () => {

    beforeEach(() => {
      let data = new Buffer('a2969485a2a399899587', 'hex');
      e = new DataQueueEntry(data, new Buffer('DATA'), new Converter());
    });

    it('should convert', () => {
      e.toString().should.equal('somestring');
    });

  });

});
