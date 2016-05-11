'use strict';

import PortMapper from '../../../src/service/port-mapper';
import RemoteCommandService from '../../../src/service/remote-command-service';

import sinon from 'sinon';
import Mitm from 'mitm';

require('../../common');

describe('PortMapper', () => {

  let portMapper, mitm;

  describe('#constructor()', () => {

    it('should create instance with default port', () => {
      portMapper = new PortMapper();
      portMapper.port.should.equal(449);
      portMapper.useDefault.should.equal(false);
      portMapper.useTLS.should.equal(false);
    });

    it('should created instance with specified port, use defaults, and use TLS', () => {
      portMapper = new PortMapper({port: 9449, useDefault: true, useTLS: true});
      portMapper.port.should.equal(9449);
      portMapper.useDefault.should.equal(true);
      portMapper.useTLS.should.equal(true);
    });

  });

  describe('#getServiceConnection()', () => {

    let unknownService = false;
    let queryServicePort;
    let cacheGet;

    beforeEach(() => {
      mitm = Mitm();
      mitm.on('connection', (socket) => {
        socket.on('data', (data) => {
          if (unknownService) {
            socket.write(new Buffer([0,0,0,0,0]));
          } else {
            let res = new Buffer(5);
            res[0] = 0x2B;
            res.writeUIntBE(8475, 1, 4);
            socket.write(res);
          }
        });
      });
      portMapper = new PortMapper({port:449});
      queryServicePort = sinon.spy(portMapper, 'queryServicePort');
    });

    afterEach(() => {
      mitm.disable();
      unknownService = false;
      queryServicePort.restore();
    });

    it('should fail due to connection refused', () => {
      mitm.disable();
      return portMapper.getServiceConnection('localhost', RemoteCommandService.SERVICE).should.be.rejectedWith(/ECONNREFUSED/);
    });

    it('should fail due to unknown service', () => {
      unknownService = true;
      return portMapper.getServiceConnection('localhost', RemoteCommandService.SERVICE).should.be.rejectedWith(/Unknown service/);
    });

    it('should query service port', (done) => {
      portMapper.getServiceConnection('localhost', RemoteCommandService.SERVICE).then((res) => {
        queryServicePort.called.should.equal(true);
        res.should.have.property('writable').that.equals(true);
        done();
      }).catch((err) => {
        done(err);
      });
    });

    it('should get port from cache', (done) => {
      portMapper.cachePort('localhost', 'as-rmtcmd', 8476);
      portMapper.getServiceConnection('localhost', RemoteCommandService.SERVICE).then((res) => {
        queryServicePort.called.should.equal(false);
        res.should.have.property('writable').that.equals(true);
        done();
      }).catch((err) => {
        done(err);
      });
    });

    it('should use default port', (done) => {
      portMapper.useDefault = true;
      portMapper.getServiceConnection('localhost', RemoteCommandService.SERVICE).then((res) => {
        queryServicePort.called.should.equal(false);
        res.should.have.property('writable').that.equals(true);
        done();
      }).catch((err) => {
        done(err);
      });
    });

    it('should fail to get TLS connection due to connection refused', () => {
      portMapper.useDefault = true;
      portMapper.useTLS = true;
      mitm.disable();
      return portMapper.getServiceConnection('localhost', RemoteCommandService.SERVICE).should.be.rejectedWith(/ECONNREFUSED/);
    });

    it('should query TLS service port', (done) => {
      portMapper.useTLS = true;
      portMapper.getServiceConnection('localhost', RemoteCommandService.SERVICE).then((res) => {
        queryServicePort.called.should.equal(true);
        res.should.have.property('writable').that.equals(true);
        done();
      }).catch((err) => {
        done(err);
      });
    });

  });

});
