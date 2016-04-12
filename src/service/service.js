'use strict';

import crypto from 'crypto';

const debug = require('debug')('ibmi:service:service');
let error = require('debug')('ibmi:service:service:error');
error.color = 1;

/**
 * Base service class.
 */
export default class Service {

  /**
   * Constructor.
   */
  constructor(system, serviceInfo) {
    if ((!system || !system.constructor || !system.constructor.name) || system.constructor.name != 'IBMi') {
      throw new Error('Invalid IBMi system');
    }

    if (!serviceInfo || !serviceInfo.id || !serviceInfo.name) {
      throw new Error('Invalid service info');
    }

    this.system = system;
    this.id = serviceInfo.id;
    this.name = serviceInfo.name;
    this.connectionId = crypto.randomBytes(4).readUInt16BE(0);
    debug('Service with id of %d and name of %s created to %s with connection ID of %d', this.id, this.name, this.system.hostName, this.connectionId);
  }

  /**
   * Connect.
   */
  async connect() {
    let res;
    try {
      debug('Attempt to connect to service %d to %s with connection ID of %d', this.id, this.system.hostName, this.connectionId);
      res = await this.system.getConnection({ id: this.id, name: this.name}, this.connectionId);
      this.connection = res;
      this.socket = this.connection.socket;
      debug('Connected to %s', this.system.hostName);
    } catch (err) {
      debug('Failed to connect to service %d on %s: %s', this.id, this.system.hostName, err);
      throw(err);
    }
    return res;
  }

  /**
   * Disconnect
   */
  disconnect() {
    debug('Disconnecting service %d from %s with connection ID of %d', this.id, this.system.hostName, this.connectionId);
    if (this.socket) {
      this.socket.end();
    }
  }

  sendPacket(req) {
    req.correlationId = this.connectionId;
    debug('Send packet with correlation of %s', req.correlationId.toString(16));
    debug('Packet data is %s', req.data.toString('hex'));
    this.socket.write(req.data);
  }

}
