'use strict';

import IBMi from '../../../src/ibmi';
import Server from '../../mock/server/server';
import DataQueue from '../../../src/data-queue/data-queue';

require('../../common');

let host = process.env.IBMI_HOST || 'localhost';
let userId = process.env.IBMI_USER || 'USER';
let password = process.env.IBMI_PASSWORD || 'PASS';
let queuePath = process.env.IBMI_QUEUE || '/QSYS.lib/SOMELIB.LIB/SOMEQUEUE.DTAQ';
let portMapperPort = 449;

describe('DataQueue', () => {

  let ibmi, server;

  before((done) => {
    if (host == 'localhost') {
      portMapperPort = 9449;
    }

    let opts = {
      hostName: host,
      userId: userId,
      password: password,
      portMapperPort: portMapperPort
    };
    ibmi = new IBMi(opts);

    if (host == 'localhost') {
      server = new Server(portMapperPort);
      server.start().then((res) => {
        done();
      }).catch((err) => {
        done(err);
      });
    } else {
      done();
    }
  });

  afterEach(() => {
    ibmi.userId = userId;
    ibmi.disconnectAll();
  });

  after((done) => {
    if (host == 'localhost') {
      server.stop().then((res) => {
        done();
      }).catch((err) => {
        done(err);
      });
    } else {
      done();
    }
  });

  describe('#create()', () => {

    it('should fail to create', function() {
      this.timeout(10000);
      let dq = new DataQueue(ibmi, '/QSYS.lib/SOMELIB.LIB/BAD.DTAQ');
      return dq.create(25).should.be.rejectedWith(/Failed to create/);
    });

    it('should create', function() {
      this.timeout(10000);
      let dq = new DataQueue(ibmi, queuePath);
      return dq.create(25).should.be.fulfilled;
    });

  });

  describe('#write()', () => {

    it('should fail to write', function() {
      this.timeout(10000);
      let dq = new DataQueue(ibmi, '/QSYS.lib/SOMELIB.LIB/BAD.DTAQ');
      return dq.write(new Buffer('DATA')).should.be.rejectedWith(/Write failed with code/);
    });

    it('should write', function() {
      this.timeout(10000);
      let dq = new DataQueue(ibmi, queuePath);
      return dq.write(new Buffer('DATA')).should.be.fulfilled;
    });

  });

  describe('#clear()', () => {

    it('should fail to clear', function() {
      this.timeout(10000);
      let dq = new DataQueue(ibmi, '/QSYS.lib/SOMELIB.LIB/BAD.DTAQ');
      return dq.clear().should.be.rejectedWith(/Clear failed with code/);
    });

    it('should clear', function() {
      this.timeout(10000);
      let dq = new DataQueue(ibmi, queuePath);
      return dq.clear().should.be.fulfilled;
    });

  });

  describe('#delete()', () => {

    it('should fail to delete', function() {
      this.timeout(10000);
      let dq = new DataQueue(ibmi, '/QSYS.lib/SOMELIB.LIB/BAD.DTAQ');
      return dq.delete().should.be.rejectedWith(/Failed to delete/);
    });

    it('should delete', function() {
      this.timeout(10000);
      let dq = new DataQueue(ibmi, queuePath);
      return dq.delete().should.be.fulfilled;
    });

  });

});
