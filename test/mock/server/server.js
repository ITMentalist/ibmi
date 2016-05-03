'use strict';

const debug = require('debug')('ibmi:mock:server:server');

import PortMapper from './port-mapper';
import Signon from './signon';
import DataQueue from './data-queue';

export default class Server {

  constructor(portMapperPort) {
    this.portMapperPort = portMapperPort;
    this.portMapper = new PortMapper(this.portMapperPort);
    this.signon = new Signon();
    this.dataQueue = new DataQueue();
  }

  async start() {
    debug('Starting');
    await Promise.all([
      this.portMapper.start(),
      this.signon.start(),
      this.dataQueue.start()
    ]);
  }

  async stop() {
    debug('Stopping');
    await Promise.all([
      this.portMapper.stop(),
      this.signon.stop(),
      this.dataQueue.stop()
    ]);
  }

}
