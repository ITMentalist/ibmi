'use strict';

import Signon from '../../../src/service/signon';
import IBMi from '../../../src/ibmi';
import Packet from '../../../src/packet/packet';
import { SignonSeedExchangeRequest } from '../../../src/packet/signon-seed-exchange';
import { SignonInfoRequest } from '../../../src/packet/signon-info';

import net from 'net';
import sinon from 'sinon';
import Mitm from 'mitm';

require('../../common');

describe('Signon', () => {

  let signon, system, mitm, invalidSeedExchangeResponse = false;
  let getConnection, seedExchangeError = false, invalidInfoResponse = false, infoError = false;

  beforeEach(() => {
    system = new IBMi({
      hostName: 'localhost',
      userId: 'GOOD',
      password: 'GOOD'
    });
    signon = new Signon(system);
    mitm = Mitm();
    getConnection = sinon.stub(signon.system, 'getConnection', () => {
      return new Promise((resolve, reject) => {
        let socket = net.connect();
        socket.on('connect', () => {
          resolve({socket: socket, connectionId: signon.connectionId});
        });
        socket.on('error', (err) => {
          reject(err);
        });
      });
    });
    mitm.on('connection', (socket) => {
      socket.on('data', (data) => {
        let packet = new Packet(data);
        if (packet.requestResponseId == SignonSeedExchangeRequest.ID) {
          if (invalidSeedExchangeResponse) {
            socket.write(new Buffer('bad'));
          } else if (seedExchangeError) {
            let res = new Buffer(24);
            res.fill(0);
            res[23] = 1;
            socket.write(res);
          } else {
            let res = new Buffer('0000005e0000e00900000000000000000004f003000000000000000a110100070200000000081102000a0000000e110332fb519d75168f57000000071119000000001f111f00000000f9f6f7f2f7f261d8e4e2c5d961d8e9e2d6e2c9c7d5',
                                 'hex');
            socket.write(res);
          }
        } else if (packet.requestResponseId == SignonInfoRequest.ID) {
          if (invalidInfoResponse) {
            socket.write(new Buffer('bad'));
          } else if (infoError) {
            let res = new Buffer(24);
            res.fill(0);
            res[23] = 1;
            socket.write(res);
          } else {
            let b = new Buffer('000000750000e00900000000000000000004f004000000000000000e110607df071c0b1f31000000000e110707df071c0b1e0100000000081109000000000008110a000300000007110ef30000000a112c000000070000000e110be08d2a9576e799150000000a11140000002500000008112a0000', 'hex');
            socket.write(b);
          }
        }
      });
    });
  });

  afterEach(() => {
    mitm.disable();
    getConnection.restore();
    invalidSeedExchangeResponse = false;
    seedExchangeError = false;
    invalidInfoResponse = false;
    infoError = false;
    signon.disconnect();
  });

  describe('#constructor()', () => {

    it('should fail to create instance due to invalid parameters', () => {
      expect(() => {return new Signon();}).to.throw(/Invalid IBMi system/);
      expect(() => {return new Signon({});}).to.throw(/Invalid IBMi system/);
    });

    it('should create new instance', () => {
      signon = new Signon(system);
      should.exist(signon.connectionId);
    });

  });

  describe('#signon()', () => {

    it('should fail due to connection error', () => {
      mitm.disable();
      return signon.signon().should.be.rejectedWith(/ECONNREFUSED/);
    });

    it('should fail due to invalid seed exchange response', () => {
      invalidSeedExchangeResponse = true;
      return signon.signon().should.be.rejectedWith(/Invalid seed exchange response received/);
    });

    it('should fail due to seed exchange error', () => {
      seedExchangeError = true;
      return signon.signon().should.be.rejectedWith(/Error received during signon seed exchange/);
    });

    it('should fail due to invalid info response', () => {
      invalidInfoResponse = true;
      return signon.signon().should.be.rejectedWith(/Invalid info response received/);
    });

    it('should fail due to info error', () => {
      infoError = true;
      return signon.signon().should.be.rejectedWith(/Error received during signon info/);
    });

    it('should succeed', () => {
      return signon.signon().should.eventually.be.fulfilled;
    });

  });

});
