'use strict';

import IBMi from '../../src/ibmi';
import Server from '../mock/server/server';

require('../common');

let host = process.env.IBMI_HOST || 'localhost';
let userId = process.env.IBMI_USER || 'USER';
let password = process.env.IBMI_PASSWORD || 'PASS';
let portMapperPort = 449;

describe('IBMi', () => {

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

  describe('#signon()', () => {

    it('should fail to sign on', function() {
      this.timeout(10000);
      ibmi.userId = 'BAD';
      return ibmi.signon().should.be.rejectedWith(/Unknown user ID/);
    });

    it('should signon', function() {
      this.timeout(10000);
      return ibmi.signon().should.eventually.have.property('serverCCSID');
    });

  });

});
