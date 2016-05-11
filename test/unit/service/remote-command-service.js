'use strict';

import RemoteCommandService from '../../../src/service/remote-command-service';
import IBMi from '../../../src/ibmi';
import Packet from '../../../src/packet/packet';
import { RemoteCommandExchangeAttributesRequest, RemoteCommandExchangeAttributesResponse } from '../../../src/packet/remote-command-exchange-attributes';

import Mitm from 'mitm';
import sinon from 'sinon';
import net from 'net';

require('../../common');

describe('RemoteCommandService', () => {

  let remoteCommandService, system, mitm, getConnection;
  let invalidExchangeAttributesResponse = false, exchangeAttributesError = false, serverDsLevel = 11;

  beforeEach(() => {
    system = new IBMi({
      hostName: 'localhost',
      userId: 'GOOD',
      password: 'GOOD'
    });
    system.serverCCSID = 37;
    remoteCommandService = new RemoteCommandService(system);
    mitm = Mitm();
    getConnection = sinon.stub(remoteCommandService.system, 'getConnection', () => {
      return new Promise((resolve, reject) => {
        let socket = net.connect();
        socket.on('connect', () => {
          resolve({socket: socket, connectionId: remoteCommandService.connectionId, jobString: '1/1/1'});
        });
        socket.on('error', (err) => {
          reject(err);
        });
      });
    });
    mitm.on('connection', (socket) => {
      socket.on('data', (data) => {
        let packet = new Packet(data);
        if (packet.requestResponseId == RemoteCommandExchangeAttributesRequest.ID) {
          if (invalidExchangeAttributesResponse) {
            socket.write(new Buffer('bad'));
          } else if (exchangeAttributesError) {
            let p = new RemoteCommandExchangeAttributesResponse();
            p.rc = 1;
            socket.write(p.data);
          } else {
            let p = new RemoteCommandExchangeAttributesResponse();
            p.dsLevel = serverDsLevel;
            p.ccsid = 37;
            socket.write(p.data);
          }
        }
      });
    });
  });

  afterEach(() => {
    mitm.disable();
    getConnection.restore();
    invalidExchangeAttributesResponse = false;
    exchangeAttributesError = false;
    serverDsLevel = 11;
  });

  describe('#constructor()', () => {

    it('should fail to create instance due to invalid parameters', () => {
      expect(() => {return new RemoteCommandService();}).to.throw(/Invalid IBMi system/);
      expect(() => {return new RemoteCommandService({});}).to.throw(/Invalid IBMi system/);
    });

    it('should create new instance', () => {
      remoteCommandService = new RemoteCommandService(system);
      should.exist(remoteCommandService.connectionId);
    });

  });

  describe('#getJobInfo()', () => {

    it('should fail due to connection error', () => {
      mitm.disable();
      return remoteCommandService.getJobInfo().should.be.rejectedWith(/ECONNREFUSED/);
    });

    it('should fail due to invalid exchange attributes response', () => {
      invalidExchangeAttributesResponse = true;
      return remoteCommandService.getJobInfo().should.be.rejectedWith(/Invalid exchange attributes response/);
    });

    it('should fail due to exchange attributes error', () => {
      exchangeAttributesError = true;
      return remoteCommandService.getJobInfo().should.be.rejectedWith(/Error received during exchange attribute/);
    });

    it('should succeed and exchange attributes', () => {
      return remoteCommandService.getJobInfo().should.eventually.be.fulfilled;
    });

    it('should succeed with server data stream level < 10', () => {
      serverDsLevel = 9;
      return remoteCommandService.getJobInfo().should.eventually.be.fulfilled;
    });

    it('should succeed and skip exchange attributes', () => {
      remoteCommandService.attributesExchanged = true;
      return remoteCommandService.getJobInfo().should.eventually.be.fulfilled;
    });

  });

});
