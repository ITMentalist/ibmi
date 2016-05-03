'use strict';

import net from 'net';

const debug = require('debug')('ibmi:mock:server:port-mapper');

export default class PortMapper {

  constructor(port) {
    this.port = port;
    this.connections = new Map();
  }

  async start() {
    debug('Starting');
    await this.listen();
  }

  async stop() {
    debug('Stopping');
    this.connections.forEach((socket) => {
      socket.destroy();
    });
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(true);
        }
      });
    });
  }

  listen() {
    return new Promise((resolve, reject) => {
      this.server = net.createServer(this.handleConnection.bind(this));
      this.server.listen(this.port, (err) => {
        if (err) {
          reject(err);
        } else {
          debug('Listening on %d', this.port);
          resolve(true);
        }
      });
    });
  }

  handleConnection(socket) {
    let key = socket.remoteAddress + ':' + socket.remotePort;
    debug('New connection with key %s', key);
    this.connections.set(key, socket);
    socket.on('close', () => {
      this.connections.delete(key);
    });
    socket.on('data', (data) => {
      debug('Received data: %s', data.toString());
      let resp = this.buildResponse(data.toString());
      socket.end(resp);
    });
  }

  buildResponse(serviceName) {
    let resp = new Buffer(5);
    resp.fill(0);
    if (serviceName == 'as-signon') {
      resp[0] = 0x2B;
      resp.writeUIntBE(8476, 1, 4);
    } else if (serviceName == 'as-rmtcmd') {
      resp[0] = 0x2B;
      resp.writeUIntBE(8475, 1, 4);
    } else if (serviceName == 'as-dtaq') {
      resp[0] = 0x2B;
      resp.writeUIntBE(8472, 1, 4);
    }
    return resp;
  }

}
