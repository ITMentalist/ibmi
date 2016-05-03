'use strict';

import DataQueueService from '../../src/service/data-queue-service';
import Packet from '../../src/packet/packet';
import { RandomSeedExchangeRequest, RandomSeedExchangeResponse } from '../../src/packet/random-seed-exchange';
import { StartServerRequest, StartServerResponse } from '../../src/packet/start-server';

import SignonServiceMock from '../mock/signon-service-mock';

import net from 'net';
import crypto from 'crypto';
import Mitm from 'mitm';
import sinon from 'sinon';

const proxyquire = require('proxyquire').noCallThru();

require('../common');

describe('IBMi', () => {

  let IBMi, ibmi, mitm;

  beforeEach(() => {
    IBMi = proxyquire.load('../../src/ibmi',
                           {
                             './service/signon-service': SignonServiceMock
                           }).default;
  });

  describe('#constructor()', () => {

    it('should fail to create new instance due to incorrect parameters', () => {
      let opts = {};
      expect(() => {return new IBMi();}).to.throw(/A valid host name is required/);
      expect(() => {return new IBMi(opts);}).to.throw(/A valid host name is required/);
      opts.hostName = 'localhost';
      expect(() => {return new IBMi(opts);}).to.throw(/A valid user ID is required/);
      opts.userId = 'USER';
      expect(() => {return new IBMi(opts);}).to.throw(/A valid password is required/);
    });

    it('should create new instance with default options', () => {
      let opts = {
        hostName: 'localhost',
        userId: 'USER',
        password: 'PASS'
      };
      ibmi = new IBMi(opts);
      ibmi.hostName.should.equal(opts.hostName);
      ibmi.userId.should.equal(opts.userId);
      ibmi.password.should.equal(opts.password);
      ibmi.portMapperPort.should.equal(449);
      ibmi.useDefaultPorts.should.equal(false);
      ibmi.useTLS.should.equal(false)
      ibmi.nlv = '2924';
      ibmi.ccsid = 0;
      ibmi.portMapper.port.should.equal(449);
      ibmi.portMapper.useDefault.should.equal(false);
      ibmi.portMapper.useTLS.should.equal(false);
    });

    it('should create new instance with specific options', () => {
      let opts = {
        hostName: 'localhost',
        userId: 'USER',
        password: 'PASS',
        portMapperPort: 9449,
        useDefaultPorts: true,
        useTLS: true
      };
      ibmi = new IBMi(opts);
      ibmi.hostName.should.equal(opts.hostName);
      ibmi.userId.should.equal(opts.userId);
      ibmi.password.should.equal(opts.password);
      ibmi.portMapperPort.should.equal(9449);
      ibmi.useDefaultPorts.should.equal(true);
      ibmi.useTLS.should.equal(true)
      ibmi.portMapper.port.should.equal(9449);
      ibmi.portMapper.useDefault.should.equal(true);
      ibmi.portMapper.useTLS.should.equal(true);
    });

  });

  describe('#getConnection()', () => {

    let connectionId, getServiceConnection, invalidRandomSeedExchangeResponse = false;
    let createNewConnection, randomSeedExchangeError = false, invalidStartServerResponse = false;
    let startServerError = false;

    beforeEach(() => {
      let opts = {
        hostName: 'localhost',
        userId: 'GOOD',
        password: 'GOOD',
        useDefaultPorts: true
      };
      ibmi = new IBMi(opts);
      connectionId = crypto.randomBytes(4).readUInt16BE(0);
      mitm = Mitm();
      getServiceConnection = sinon.stub(ibmi.portMapper, 'getServiceConnection', () => {
        return new Promise((resolve, reject) => {
          let socket = net.connect();
          socket.on('connect', () => {
            resolve(socket);
          });
          socket.on('error', (err) => {
            reject(err);
          });
        });
      });
      mitm.on('connection', (socket) => {
        socket.on('data', (data) => {
          let packet = new Packet(data);
          if (packet.requestResponseId == RandomSeedExchangeRequest.ID) {
            if (invalidRandomSeedExchangeResponse) {
              socket.write(new Buffer('bad'));
            } else if (randomSeedExchangeError) {
              let res = new RandomSeedExchangeResponse();
              res.rc = 1;
              socket.write(res.data);
            } else {
              let res = new RandomSeedExchangeResponse();
              res.seed = crypto.randomBytes(8);
              socket.write(res.data);
            }
          } else if (packet.requestResponseId == StartServerRequest.ID) {
            if (invalidStartServerResponse) {
              socket.write(new Buffer('bad'));
            } else if (startServerError) {
              let res = new StartServerResponse();
              res.rc = 1;
              socket.write(res.data);
            } else {
              let res = new StartServerResponse();
              socket.write(res.data);
            }
          }
        });
      });
      createNewConnection = sinon.spy(ibmi, 'createNewConnection');
    });

    afterEach(() => {
      getServiceConnection.restore();
      mitm.disable();
      invalidRandomSeedExchangeResponse = false;
      randomSeedExchangeError = false;
      invalidStartServerResponse = false;
      startServerError = false;
      createNewConnection.restore();
      ibmi.disconnectAll();
    });

    it('should fail due to invalid random seed exchange response', () => {
      invalidRandomSeedExchangeResponse = true;
      return ibmi.getConnection(DataQueueService.SERVICE, connectionId).should.be.rejectedWith(/Invalid random seed exchange response/);
    });

    it('should fail due to random seed exchange error', () => {
      randomSeedExchangeError = true;
      return ibmi.getConnection(DataQueueService.SERVICE, connectionId).should.be.rejectedWith(/Error received during start server/);
    });

    it('should fail due to invalid start server response', () => {
      invalidStartServerResponse = true;
      return ibmi.getConnection(DataQueueService.SERVICE, connectionId).should.be.rejectedWith(/Invalid start server response/);
    });

    it('should fail due to start server error', () => {
      startServerError = true;
      return ibmi.getConnection(DataQueueService.SERVICE, connectionId).should.be.rejectedWith(/Error received during start server/);
    });

    it('should get signon connection', () => {
      return ibmi.getConnection(SignonServiceMock.SERVICE, connectionId).should.eventually.have.property('socket');
    });

    it('should get existing signon connection', (done) => {
      ibmi.connections.set(connectionId, { socket: {end:function(){}}});
      ibmi.getConnection(SignonServiceMock.SERVICE, connectionId).then((res) => {
        res.should.have.property('socket');
        createNewConnection.called.should.equal(false);
        done();
      }).catch((err) => {
        done(err);
      });
    });

    it('should get non signon connection', () => {
      return ibmi.getConnection(DataQueueService.SERVICE, connectionId).should.eventually.have.property('socket');
    });

  });

  describe('#signon()', () => {

    beforeEach(() => {
      let opts = {
        hostName: 'localhost',
        userId: 'GOOD',
        password: 'GOOD',
        useDefaultPorts: true
      };
      ibmi = new IBMi(opts);
    });

    afterEach(() => {
      ibmi.disconnectAll();
    });

    it('should fail to signon', () => {
      ibmi.userId = 'BAD';
      return ibmi.signon().should.be.rejectedWith(/ERROR/);
    });

    it('should succeed', () => {
      return ibmi.signon().should.eventually.be.fulfilled;
    });

  });

});
