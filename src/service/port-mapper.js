'use strict';

import net from 'net';
import tls from 'tls';

const debug = require('debug')('ibmi:service:port-mapper');
let error = require('debug')('ibmi:service:port-mapper:error');
error.color = 1;

export default class PortMapper {

  /**
   * Constructor.
   */
  constructor(opts) {
    opts = opts || { };
    this.port = opts.port || 449;
    this.useDefault = opts.useDefault || false;
    this.useTLS = opts.useTLS || false;
    this.hosts = new Map();
    debug('Port mapper created with port of %d, use default = %s, use TLS = %s', this.port, this.useDefault, this.useTLS);
  }

  /**
   * Get a service connection on the specified host.
   */
  async getServiceConnection(hostName, service) {
    debug('Attempt to get a service connection on %s to %j', hostName, service);

    let serviceName = service.name;
    if (this.useTLS) {
      serviceName += '-s';
    }
    debug('Service name is %s', serviceName);

    let socket;
    try {
      let serverPort;
      // Check cache first
      if (this.hosts.get(hostName) && this.hosts.get(hostName).get(serviceName)) {
        debug('Port for %s on %s found in cache', serviceName, hostName);
        serverPort = this.hosts.get(hostName).get(serviceName);
      } else {
        if (this.useDefault) { // Just use default service port
          if (this.useTLS) {
            serverPort = service.defaultTLSPort;
          } else {
            serverPort = service.defaultPort;
          }
        } else { // Otherwise connect to port mapper and query service
          this.socket = await this.getSocketConnection(hostName, this.port);
          serverPort = await this.queryServicePort(serviceName);
        }
      }
      debug('Server port is %d', serverPort);
      this.cachePort(hostName, serviceName, serverPort);
      if (this.useTLS) {
        socket = await this.getTLSSocketConnection(hostName, serverPort);
      } else {
        socket = await this.getSocketConnection(hostName, serverPort);
      }
    } catch(err) {
      error('Failed to get service connection %s', err);
      throw(err);
    } finally {
      if (this.socket) {
        this.socket.end();
      }
    }
    return socket;
  }

  /**
   * Cache the service port.
   */
  cachePort(hostName, serviceName, port) {
    if (this.hosts.get(hostName)) {
      debug('Host name %s found in cache, set %s to %d', hostName, serviceName, port);
      this.hosts.get(hostName).set(serviceName, port);
    } else {
      debug('Host name %s not found in cache, create it', hostName);
      this.hosts.set(hostName, new Map());
      this.cachePort(hostName, serviceName, port);
    }
  }

  /**
   * Query the service port.
   */
  queryServicePort(serviceName) {
    return new Promise((resolve, reject) => {
      this.socket.once('data', (data) => {
        debug('Received port mapper data %s', data.toString('hex'));
        if(data[0] == 0x2B) { // Success
          let port = data.readUIntBE(1, 4);
          debug('Port for %s is %d', serviceName, port);
          resolve(port);
        } else {
          reject(new Error('Unknown service: ' + serviceName));
        }
      });
      this.socket.write(serviceName);
    });
  }

  /**
   * Get a socket connection.
   */
  getSocketConnection(hostName, port) {
    return new Promise((resolve, reject) => {
      debug('Attempt to get socket connection to %s on port %d', hostName, port);
      let socket = net.connect(port, hostName);
      socket.once('error', (err) => {
        reject(err);
      });
      socket.on('connect', () => {
        debug('Connected to %s on %d', hostName, port);
        resolve(socket);
      });
    });
  }

  /**
   * Get a TLS socket connection.
   */
  getTLSSocketConnection(hostName, port) {
    return new Promise((resolve, reject) => {
      debug('Attempt to get TLS socket connection to %s on port %d', hostName, port);
      let socket = tls.connect(port, hostName);
      socket.once('error', (err) => {
        reject(err);
      });
      socket.on('connect', () => {
        debug('Connected to %s on %d', hostName, port);
        resolve(socket);
      });
    });
  }

}
