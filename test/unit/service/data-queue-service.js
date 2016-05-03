'use strict';

import DataQueueService from '../../../src/service/data-queue-service';
import IBMi from '../../../src/ibmi';
import Packet from '../../../src/packet/packet';
import { DataQueueExchangeAttributesRequest, DataQueueExchangeAttributesResponse } from '../../../src/packet/data-queue-exchange-attributes';
import DataQueueReturnCodeResponse from '../../../src/packet/data-queue-return-code';

import Mitm from 'mitm';
import sinon from 'sinon';
import net from 'net';

require('../../common');

describe('DataQueueService', () => {

  let dataQueueService, system, mitm, getConnection;
  let invalidExchangeAttributesResponse = false, exchangeAttributeError = false;
  let invalidExchangeAttributesResponseId = false;

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
        if (packet.requestResponseId == DataQueueExchangeAttributesRequest.ID) {
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

    it('should fail due to invalid data', () => {
      return dataQueueService.write().should.be.rejectedWith(/Invalid data/);
    });

    it('should fail due to connection error', () => {
      mitm.disable();
      return dataQueueService.write(null, new Buffer('DATA')).should.be.rejectedWith(/ECONNREFUSED/);
    });

    it('should fail due invalid exchange attributes response', () => {
      invalidExchangeAttributesResponse = true;
      return dataQueueService.write(null, new Buffer('DATA')).should.be.rejectedWith(/Invalid exchange attributes response/);
    });

    it('should fail due to exchange attribute error', () => {
      exchangeAttributeError = true;
      return dataQueueService.write(null, new Buffer('DATA')).should.be.rejectedWith(/Error received during attribute exchange/);
    });

    it('should fail due to invalid exchnage attributes response id', () => {
      invalidExchangeAttributesResponseId = true;
      return dataQueueService.write(null, new Buffer('DATA')).should.be.rejectedWith(/Invalid exchange attributes response ID/);
    });

    it('should succeed', () => {
      return dataQueueService.write(null, new Buffer('DATA')).should.be.fulfilled;
    });

    it('should succeed and not exchange attributes', () => {
      dataQueueService.attributesExchanged = true;
      return dataQueueService.write(null, new Buffer('DATA')).should.be.fulfilled;
    });

  });

});
