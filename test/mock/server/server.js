'use strict';

const debug = require('debug')('ibmi:mock:server:server');

import PortMapper from './port-mapper';
import Signon from './signon';

export default class Server {

  constructor(portMapperPort) {
    this.portMapperPort = portMapperPort;
    this.portMapper = new PortMapper(this.portMapperPort);
    this.signon = new Signon();
  }

  async start() {
    debug('Starting');
    await Promise.all([
      this.portMapper.start(),
      this.signon.start()
    ]);
  }

  async stop() {
    debug('Stopping');
    await Promise.all([
      this.portMapper.stop(),
      this.signon.stop()
    ]);
  }

}
