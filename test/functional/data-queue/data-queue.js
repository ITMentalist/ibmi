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

  describe('#peek()', () => {

    it('should fail to peek', function() {
      this.timeout(10000);
      let dq = new DataQueue(ibmi, '/QSYS.lib/SOMELIB.LIB/BAD.DTAQ');
      return dq.peek().should.be.rejectedWith(/Read failed with code/);
    });

    it('should peek', function(done) {
      this.timeout(10000);
      let dq = new DataQueue(ibmi, queuePath);
      dq.peek().then((res) => {
        should.exist(res);
        should.exist(res.data);
        res.data.toString().should.equal('DATA');
        done();
      }).catch((err) => {
        done(err);
      });
    });

  });

  describe('#read()', () => {

    it('should fail to read', function() {
      this.timeout(10000);
      let dq = new DataQueue(ibmi, '/QSYS.lib/SOMELIB.LIB/BAD.DTAQ');
      return dq.read().should.be.rejectedWith(/Read failed with code/);
    });

    it('should read', function(done) {
      this.timeout(10000);
      let dq = new DataQueue(ibmi, queuePath);
      dq.read().then((res) => {
        should.exist(res);
        should.exist(res.data);
        res.data.toString().should.equal('DATA');
        done();
      }).catch((err) => {
        done(err);
      });
    });

    it('should read no data', function(done) {
      this.timeout(10000);
      let dq = new DataQueue(ibmi, queuePath);
      dq.read().then((res) => {
        should.not.exist(res);
        done();
      }).catch((err) => {
        done(err);
      });
    });

  });

  /*describe('#clear()', () => {

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

  });*/

});
