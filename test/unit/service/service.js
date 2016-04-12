'use strict';

import Service from '../../../src/service/service';
import Signon from '../../../src/service/signon';
import IBMi from '../../../src/ibmi';
import Packet from '../../../src/packet/packet';

import sinon from 'sinon';

require('../../common');

describe('Service', () => {

  let service, system, getConnection, getConnectionError = false;

  beforeEach(() => {
    system = new IBMi({
      hostName: 'localhost',
      userId: 'GOOD',
      password: 'GOOD'
    });
    getConnection = sinon.stub(system, 'getConnection', () => {
      return new Promise((resolve, reject) => {
        if (getConnectionError) {
          reject('ERROR');
        } else {
          resolve({socket: {end: function(){}, write: function(){}}});
        }
      });
    });
  });

  afterEach(() => {
    getConnectionError = false;
    getConnection.restore();
  });

  describe('#constructor()', () => {

    it('should fail to create instance due to invalid parameters', () => {
      expect(() => {return new Service();}).to.throw(/Invalid IBMi system/);
      expect(() => {return new Service({});}).to.throw(/Invalid IBMi system/);
      expect(() => {return new Service(system);}).to.throw(/Invalid service info/);
      expect(() => {return new Service(system, {});}).to.throw(/Invalid service info/);
      expect(() => {return new Service(system, {id: Signon.SERVICE.id});}).to.throw(/Invalid service info/);
    });

    it('should create new instance', () => {
      service = new Service(system, { id: Signon.SERVICE.id, name: Signon.SERVICE.name });
      should.exist(service.connectionId);
      service.id.should.equal(Signon.SERVICE.id);
    });

  });

  describe('#connect()', () => {

    beforeEach(() => {
      service = new Service(system, Signon.SERVICE);
    });

    it('should fail due to getConnection error', () => {
      getConnectionError = true;
      return service.connect().should.be.rejectedWith(/ERROR/);
    });

    it('should connect to service', () => {
      return service.connect().should.be.fulfilled;
    });

  });

  describe('#sendPacket()', () => {

    beforeEach(() => {
      service = new Service(system, Signon.SERVICE);
    });

    it('should send packet', (done) => {
      let p = new Packet(25);
      service.connect().then((res) => {
        service.sendPacket(p);
        done();
      }).catch((err) => {
        done(err);
      });
    });

  });

  describe('#disconnect()', () => {

    beforeEach(() => {
      service = new Service(system, Signon.SERVICE);
    });

    it('should disconnect with no connection', () => {
      should.not.exist(service.socket);
      service.disconnect();
      should.not.exist(service.socket);
    });

    it('should disconnect after connected', (done) => {
      service.connect().then((res) => {
        should.exist(service.socket);
        service.disconnect();
        done();
      }).catch((err) => {
        done(err);
      });
    });

  });

});
