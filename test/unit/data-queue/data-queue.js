'use strict';

import IBMi from '../../../src/ibmi';

import DataQueueServiceMock from '../../mock/data-queue-service-mock';

require('../../common');

const proxyquire = require('proxyquire').noCallThru();

describe('DataQueue', () => {

  let DataQueue, system, dataQueue;

  beforeEach(() => {
    system = new IBMi({
      hostName: 'localhost',
      userId: 'GOOD',
      password: 'GOOD'
    });
    DataQueue = proxyquire.load('../../../src/data-queue/data-queue',
                           {
                             '../service/data-queue-service': DataQueueServiceMock
                           }).default;
  });

  afterEach(() => {
    if (dataQueue) {
      dataQueue.dataQueueService.writeError = false;
      dataQueue.dataQueueService.createError = false;
      dataQueue.dataQueueService.deleteError = false;
      dataQueue.dataQueueService.clearError = false;
    }
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

  describe('#create()', () => {

    it('should fail due to error', () => {
      dataQueue.dataQueueService.createError = true;
      return dataQueue.create(25).should.be.rejectedWith(/Failed to create/);
    });

    it('should succeed with default options', () => {
      return dataQueue.create(25).should.be.fulfilled;
    });

    it('should succeed with specfied options', () => {
      let opts = {
        authority: '*LIBCRTAUT',
        saveSenderInfo: false,
        fifo: true,
        keyLength: 0,
        forceStorage: false,
        description: 'Queue'
      };
      return dataQueue.create(25, opts).should.be.fulfilled;
    });

  });

  describe('#write()', () => {

    it('should fail due to error', () => {
      dataQueue.dataQueueService.writeError = true;
      return dataQueue.write(new Buffer('DATA'), null).should.be.rejectedWith(/Error: Write error/);
    });

    it('should succeed', () => {
      return dataQueue.write(new Buffer('DATA'), null).should.be.fulfilled;
    });

  });

  describe('#clear()', () => {

    it('should fail due to error', () => {
      dataQueue.dataQueueService.clearError = true;
      return dataQueue.clear(null).should.be.rejectedWith(/Error: Clear error/);
    });

    it('should succeed', () => {
      return dataQueue.clear(null).should.be.fulfilled;
    });

  });

  describe('#delete()', () => {

    it('should fail due to error', () => {
      dataQueue.dataQueueService.deleteError = true;
      return dataQueue.delete().should.be.rejectedWith(/Error: Delete error/);
    });

    it ('should succeed', () => {
      return dataQueue.delete().should.be.fulfilled;
    });

  });

});
