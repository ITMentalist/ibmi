'use strict';

import DataQueue from '../../../src/data-queue/data-queue';
import IBMi from '../../../src/ibmi';

require('../../common');

describe('DataQueue', () => {

  let system, dataQueue;

  beforeEach(() => {
    system = new IBMi({
      hostName: 'localhost',
      userId: 'GOOD',
      password: 'GOOD'
    });
  });

  describe('#constructor()', () => {

    it('should fail to create instance due to invalid parameters', () => {
      expect(() => {return new DataQueue();}).to.throw(/Invalid IBMi system/);
      expect(() => {return new DataQueue({});}).to.throw(/Invalid IBMi system/);
      expect(() => {return new DataQueue(system);}).to.throw(/Invalid path/);
    });

    it('should create new instance', () => {
      dataQueue = new DataQueue(system, '/QSYS.LIB/SOME.LIB/SOME.DTAQ');
      dataQueue.path.should.equal('/QSYS.LIB/SOME.LIB/SOME.DTAQ');
    });

  });

  describe('#write()', () => {

    it('should fail to write due invalid input', () => {
      return dataQueue.write().should.be.rejectedWith(/Invalid data/);
    });

  });

});
