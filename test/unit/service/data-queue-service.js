'use strict';

import DataQueueService from '../../../src/service/data-queue-service';
import IBMi from '../../../src/ibmi';
import Packet from '../../../src/packet/packet';
import { DataQueueExchangeAttributesRequest, DataQueueExchangeAttributesResponse } from '../../../src/packet/data-queue-exchange-attributes';
import { DataQueueWriteRequest } from '../../../src/packet/data-queue-write';
import { DataQueueCreateRequest } from '../../../src/packet/data-queue-create';
import { DataQueueDeleteRequest } from '../../../src/packet/data-queue-delete';
import { DataQueueClearRequest } from '../../../src/packet/data-queue-clear';
import { DataQueueReadRequest, DataQueueReadResponse } from '../../../src/packet/data-queue-read';
import DataQueueReturnCodeResponse from '../../../src/packet/data-queue-return-code';

import Mitm from 'mitm';
import sinon from 'sinon';
import net from 'net';

require('../../common');

describe('DataQueueService', () => {

  let dataQueueService, system, mitm, getConnection;
  let invalidExchangeAttributesResponse = false, exchangeAttributeError = false;
  let invalidExchangeAttributesResponseId = false, invalidWriteResponse = false;
  let invalidWriteResponseId = false, writeError = false;
  let invalidCreateResponse = false, invalidCreateResponseId = false, createError = false;
  let invalidDeleteResponse = false, invalidDeleteResponseId = false, deleteError = false;
  let invalidClearResponse = false, invalidClearResponseId = false, clearError = false;
  let invalidReadResponse = false, invalidReadResponseId = false, readError = false;
  let readEmpty = false;

  beforeEach(() => {
    system = new IBMi({
      hostName: 'localhost',
      userId: 'GOOD',
      password: 'GOOD'
    });
    dataQueueService = new DataQueueService(system);
    mitm = Mitm();
    getConnection = sinon.stub(dataQueueService.system, 'getConnection', () => {
      return new Promise((resolve, reject) => {
        let socket = net.connect();
        socket.on('connect', () => {
          resolve({socket: socket, connectionId: dataQueueService.connectionId});
          });
        socket.on('error', (err) => {
          reject(err);
        });
      });
    });
    mitm.on('connection', (socket) => {
      socket.on('data', (data) => {
        let packet = new Packet(data);
        if (packet.requestResponseId == 0 && packet.length == 26) {
          if (invalidExchangeAttributesResponse) {
            socket.write(new Buffer('bad'));
          } else if (exchangeAttributeError) {
            let p = new DataQueueReturnCodeResponse();
            p.rc = 1;
            socket.write(p.data);
          } else if (invalidExchangeAttributesResponseId) {
            let b = new Buffer(22);
            b.fill(0);
            socket.write(b);
          } else {
            let p = new DataQueueExchangeAttributesResponse();
            socket.write(p.data);
          }
        } else if (packet.requestResponseId == DataQueueWriteRequest.ID) {
          if (invalidWriteResponse) {
            socket.write(new Buffer('bad'));
          } else if (invalidWriteResponseId) {
            let b = new Buffer(22);
            b.fill(0);
            socket.write(b);
          } else if (writeError) {
            let p = new DataQueueReturnCodeResponse();
            p.rc = 1;
            socket.write(p.data);
          } else {
            let p = new DataQueueReturnCodeResponse();
            p.rc = 0xF000;
            socket.write(p.data);
          }
        } else if (packet.requestResponseId == DataQueueCreateRequest.ID) {
          if (invalidCreateResponse) {
            socket.write(new Buffer('bad'));
          } else if (invalidCreateResponseId) {
            let b = new Buffer(22);
            b.fill(0);
            socket.write(b);
          } else if (createError) {
            let p = new DataQueueReturnCodeResponse();
            p.rc = 1;
            socket.write(p.data);
          } else {
            let p = new DataQueueReturnCodeResponse();
            p.rc = 0xF000;
            socket.write(p.data);
          }
        } else if (packet.requestResponseId == DataQueueDeleteRequest.ID) {
          if (invalidDeleteResponse) {
            socket.write(new Buffer('bad'));
          } else if (invalidDeleteResponseId) {
            let b = new Buffer(22);
            b.fill(0);
            socket.write(b);
          } else if (deleteError) {
            let p = new DataQueueReturnCodeResponse();
            p.rc = 1;
            socket.write(p.data);
          } else {
            let p = new DataQueueReturnCodeResponse();
            p.rc = 0xF000;
            socket.write(p.data);
          }
        } else if (packet.requestResponseId == DataQueueClearRequest.ID) {
          if (invalidClearResponse) {
            socket.write(new Buffer('bad'));
          } else if (invalidClearResponseId) {
            let b = new Buffer(22);
            b.fill(0);
            socket.write(b);
          } else if (clearError) {
            let p = new DataQueueReturnCodeResponse();
            p.rc = 1;
            socket.write(p.data);
          } else {
            let p = new DataQueueReturnCodeResponse();
            p.rc = 0xF000;
            socket.write(p.data);
          }
        } else if (packet.requestResponseId == DataQueueReadRequest.ID) {
          if (invalidReadResponse) {
            socket.write(new Buffer('bad'));
          } else if (invalidReadResponseId) {
            let b = new Buffer(22);
            b.fill(0);
            socket.write(b);
          } else if (readError) {
            let p = new DataQueueReturnCodeResponse();
            p.rc = 1;
            socket.write(p.data);
          } else if (readEmpty) {
            let p = new DataQueueReturnCodeResponse();
            p.rc = 0xF006;
            socket.write(p.data);
          } else {
            let p = new DataQueueReadResponse();
            p.senderInfo = new Buffer('SENDER');
            p.entry = new Buffer('DATA');
            p.key = new Buffer('KEY');
            socket.write(p.data);
          }
        }
      });
    });
  });

  afterEach(() => {
    mitm.disable();
    getConnection.restore();
    dataQueueService.disconnect();
    invalidExchangeAttributesResponse = false;
    exchangeAttributeError = false;
    invalidExchangeAttributesResponseId = false;
    invalidWriteResponse = false;
    invalidWriteResponseId = false;
    writeError = false;
    invalidCreateResponse = false;
    invalidCreateResponseId = false;
    createError = false;
    invalidDeleteResponse = false;
    invalidDeleteResponseId = false;
    deleteError = false;
    invalidClearResponse = false;
    invalidClearResponseId = false;
    clearError = false;
    invalidReadResponse = false;
    invalidReadResponseId = false;
    readError = false;
    readEmpty = false;
    dataQueueService.attributesExchanged = false;
  });

  describe('#constructor()', () => {

    it('should fail to create instance due to invalid parameters', () => {
      expect(() => {return new DataQueueService();}).to.throw(/Invalid IBMi system/);
      expect(() => {return new DataQueueService({});}).to.throw(/Invalid IBMi system/);
    });

    it('should create new instance', () => {
      dataQueueService = new DataQueueService(system);
      should.exist(dataQueueService.connectionId);
    });

  });

  describe('#write()', () => {

    it('should fail due to connection error', () => {
      mitm.disable();
      return dataQueueService.write('queue', 'library', null, new Buffer('DATA')).should.be.rejectedWith(/ECONNREFUSED/);
    });

    it('should fail due invalid exchange attributes response', () => {
      invalidExchangeAttributesResponse = true;
      return dataQueueService.write('queue', 'library', null, new Buffer('DATA')).should.be.rejectedWith(/Invalid exchange attributes response/);
    });

    it('should fail due to exchange attribute error', () => {
      exchangeAttributeError = true;
      return dataQueueService.write('queue', 'library', null, new Buffer('DATA')).should.be.rejectedWith(/Error received during attribute exchange/);
    });

    it('should fail due to invalid exchange attributes response id', () => {
      invalidExchangeAttributesResponseId = true;
      return dataQueueService.write('queue', 'library', null, new Buffer('DATA')).should.be.rejectedWith(/Invalid exchange attributes response ID/);
    });

    it('should fail due to invalid write response', () => {
      invalidWriteResponse = true;
      return dataQueueService.write('queue', 'library', null, new Buffer('DATA')).should.be.rejectedWith(/Invalid write response/);
    });

    it('should fail due to invalid write response id', () => {
      invalidWriteResponseId = true;
      return dataQueueService.write('queue', 'library', null, new Buffer('DATA')).should.be.rejectedWith(/Invalid write response ID/);
    });

    it('should fail due to write error', () => {
      writeError = true;
      return dataQueueService.write('queue', 'library', null, new Buffer('DATA')).should.be.rejectedWith(/Write failed with code/);
    });

    it('should succeed', () => {
      return dataQueueService.write('queue', 'library', null, new Buffer('DATA')).should.be.fulfilled;
    });

    it('should succeed and not exchange attributes', () => {
      dataQueueService.attributesExchanged = true;
      return dataQueueService.write('queue', 'library', null, new Buffer('DATA')).should.be.fulfilled;
    });

  });

  describe('#create()', () => {

    it('should fail due to open error', () => {
      mitm.disable();
      return dataQueueService.create('queue', 'library', 25, '*ALL', true, true, 0, false, 'DESCRIPTION').should.be.rejectedWith(/ECONNREFUSED/);
    });

    it('should fail due to invalid response', () => {
      invalidCreateResponse = true;
      return dataQueueService.create('queue', 'library', 25, '*ALL', true, true, 0, false, 'DESCRIPTION').should.be.rejectedWith(/Invalid create response received/);
    });

    it('should fail due to invalid response ID', () => {
      invalidCreateResponseId = true;
      return dataQueueService.create('queue', 'library', 25, '*ALL', true, true, 0, false, 'DESCRIPTION').should.be.rejectedWith(/Invalid create response ID received/);
    });

    it('should fail due to error', () => {
      createError = true;
      return dataQueueService.create('queue', 'library', 25, '*ALL', true, true, 0, false, 'DESCRIPTION').should.be.rejectedWith(/Create failed with code/);
    });

    it('should succeed', () => {
      return dataQueueService.create('queue', 'library', 25, '*ALL', true, true, 0, false, 'DESCRIPTION').should.be.fulfilled;
    });

  });

  describe('#delete()', () => {

    it('should fail due to open error', () => {
      mitm.disable();
      return dataQueueService.delete('queue', 'library').should.be.rejectedWith(/ECONNREFUSED/);
    });

    it('should fail due to invalid response', () => {
      invalidDeleteResponse = true;
      return dataQueueService.delete('queue', 'library').should.be.rejectedWith(/Invalid delete response received/);
    });

    it('should fail due to invalid response ID', () => {
      invalidDeleteResponseId = true;
      return dataQueueService.delete('queue', 'library').should.be.rejectedWith(/Invalid delete response ID received/);
    });

    it('should fail due to error', () => {
      deleteError = true;
      return dataQueueService.delete('queue', 'library').should.be.rejectedWith(/Delete failed with code/);
    });

    it('should succeed', () => {
      return dataQueueService.delete('queue', 'library').should.be.fulfilled;
    });

  });

  describe('#clear()', () => {

    it('should fail due to open error', () => {
      mitm.disable();
      return dataQueueService.clear('queue', 'library', null).should.be.rejectedWith(/ECONNREFUSED/);
    });

    it('should fail due to invalid response', () => {
      invalidClearResponse = true;
      return dataQueueService.clear('queue', 'library', null).should.be.rejectedWith(/Invalid clear response received/);
    });

    it('should fail due to invalid response ID', () => {
      invalidClearResponseId = true;
      return dataQueueService.clear('queue', 'library', null).should.be.rejectedWith(/Invalid clear response ID received/);
    });

    it('should fail due to error', () => {
      clearError = true;
      return dataQueueService.clear('queue', 'library', null).should.be.rejectedWith(/Clear failed with code/);
    });

    it('should succeed', () => {
      return dataQueueService.clear('queue', 'library', null).should.be.fulfilled;
    });

  });

  describe('#read()', () => {

    it('should fail due to open error', () => {
      mitm.disable();
      return dataQueueService.read('queue', 'library', null, 0, false, null).should.be.rejectedWith(/ECONNREFUSED/);
    });

    it('should fail due to invalid response', () => {
      invalidReadResponse = true;
      return dataQueueService.read('queue', 'library', null, 0, false, null).should.be.rejectedWith(/Invalid read response received/);
    });

    it('should fail due to invalid respose ID', () => {
      invalidReadResponseId = true;
      return dataQueueService.read('queue', 'library', null, 0, false, null).should.be.rejectedWith(/Invalid read response ID received/);
    });

    it('should faile due to error', () => {
      readError = true;
      return dataQueueService.read('queue', 'library', null, 0, false, null).should.be.rejectedWith(/Read failed with code 1/);
    });

    it('should succed with no data', (done) => {
      readEmpty = true;
      dataQueueService.read('queue', 'library', null, 0, false, null).then((res) => {
        should.not.exist(res);
        done();
      }).catch((err) => {
        done(err);
      });
    });

    it('should succeed', (done) => {
      dataQueueService.read('queue', 'library', null, 0, false, null).then((res) => {
        should.exist(res);
        res.should.have.property('sender');
        res.should.have.property('entry');
        done();
      }).catch((err) => {
        done(err);
      });
    });

    it('should succeed with search and key', (done) => {
      dataQueueService.read('queue', 'library', new Buffer('**'), 0, false, new Buffer('KEY')).then((res) => {
        should.exist(res);
        res.should.have.property('sender');
        res.should.have.property('entry');
        res.should.have.property('key');
        res.should.have.property('converter');
        done();
      }).catch((err) => {
        done(err);
      });
    });

  });

});
