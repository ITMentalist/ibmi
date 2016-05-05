'use strict';

import DataQueueService from '../../../src/service/data-queue-service';
import IBMi from '../../../src/ibmi';
import Packet from '../../../src/packet/packet';
import { DataQueueExchangeAttributesRequest, DataQueueExchangeAttributesResponse } from '../../../src/packet/data-queue-exchange-attributes';
import { DataQueueWriteRequest } from '../../../src/packet/data-queue-write';
import { DataQueueCreateRequest } from '../../../src/packet/data-queue-create';
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

});
