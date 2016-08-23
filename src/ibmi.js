'use strict';

import PortMapper from './service/port-mapper';
import SignonService from './service/signon-service';
import Environment from './util/environment';
import { RandomSeedExchangeRequest, RandomSeedExchangeResponse } from './packet/random-seed-exchange';
import { StartServerRequest, StartServerResponse } from './packet/start-server';
import PasswordEncryptor from './util/password-encryptor';
import Converter from './types/converter';
import genericPool from 'generic-pool';

const debug = require('debug')('ibmi:ibmi');
let error = require('debug')('ibmi:ibmi:error');
error.color = 1;

/**
 * "Main" class. Represents a remote system.
 */
export default class IBMi {

  /**
   * Constructor.
   */
  constructor(opts) {
    opts = opts || { };
    // Check required options
    if (typeof(opts.hostName) != 'string') {
      throw new Error('A valid host name is required');
    }
    if (typeof(opts.userId) != 'string') {
      throw new Error('A valid user ID is required');
    }
    if (typeof(opts.password) != 'string') {
      throw new Error('A valid password is required');
    }

    this.hostName = opts.hostName;
    this.userId = opts.userId;
    this.password = opts.password;
    this.portMapperPort = opts.portMapperPort || 449;
    this.useDefaultPorts = opts.useDefaultPorts || false;
    this.useTLS = opts.useTLS || false;
    this.databasePoolOpts = opts.databasePoolOpts || {
      min: 2,
      max: 10,
      timeout: 60
    };

    this.nlv = Environment.getNlv(process.env.LANG);
    this.ccsid = 0;
    this.connections = new Map();

    this.portMapper = new PortMapper({
      port: this.portMapperPort,
      useDefault: this.useDefaultPorts,
      useTLS: this.useTLS
    });

    // Create database connection pool
    this.databasePool = new genericPool.Pool({
      name: 'IBMi',
      create: function(callback) {
      },
      destroy: function(client) { },
      max: this.databasePoolOpts.max,
      min: this.databasePoolOpts.min,
      idleTimeoutMillis: this.databasePoolOpts.timeout * 1000,
      log: true
    });

    debug('New IBMi created: host name = %s, user ID = %s, password = %s, port mapper port = %d, use default ports = %s, use TLS = %s, nlv = %s, ccsid = %d',
         this.hostName, this.userId, this.password, this.portMapperPort, this.useDefaultPorts, this.useTLS, this.nlv, this.ccsid);
  }

  disconnectAll() {
    debug('Attempt to disconnect all services from %s', this.hostName);
    for (let key of this.connections.keys()) {
      debug('Disconnecting connection %d', key);
      let connection = this.connections.get(key);
      connection.socket.end();
      this.connections.delete(key);
    }
  }

  sendPacket(packet, socket) {
    debug('Write packet with correlation of %s', packet.correlationId.toString(16));
    debug('Packet data is %s', packet.data.toString('hex'));
    socket.write(packet.data);
  }

  /**
   * Get a database connection.
   */
  async getDatabaseConnection() {
    debug('Attempt to get database connection from %s', this.hostName);
  }

  /**
   * Get a connection to the specified service.
   */
  async getConnection(service, connectionId) {
    debug('Attempt to get connection to service %s on %s with connection ID of %d', service.name, this.hostName, connectionId);

    let res;

    try {
      // First see if we already have a connection for this ID
      res = this.connections.get(connectionId);
      if (res) {
        debug('Existing connection found for ID %d, re-using it', connectionId);
      } else {
        res = await this.createNewConnection(service, connectionId);
      }
    } catch (err) {
      throw(err);
    }

    return res;
  }

  /**
   * Create a new connection. This method is here to facilitate testing.
   */
  async createNewConnection(service, connectionId) {
    let res = { };
    try {
      debug('No existing connection found for ID %d, create a new one', connectionId);
      // First get a socket
      let socket = await this.portMapper.getServiceConnection(this.hostName, service);
      res.socket = socket;
      res.connectionId = connectionId;
      // If we are not connecting to the sign on service we must perform some additional
      // extra steps.
      if (service.name != SignonService.SERVICE.name) {
        debug('Not signon service; signon, exhange attributes, and start server');
        // First we need to signon if we haven't already
        if (!this.signonPerformed) {
          debug('Must perform signon since it hasn\'t been done yet');
          await this.signon();
        }
        // Now we exchange random seeds
        let seeds = await this.exchangeRandomSeeds(service, socket, connectionId);
        // Now send a start server request
        let startServerResp = await this.startServer(seeds.clientSeed, seeds.serverSeed, service, socket, connectionId);
        debug('Start server response %j', startServerResp);
        res.jobName = startServerResp.jobName;
        let converter = new Converter({
          ccsid: this.serverCCSID
        });
        res.jobString = converter.bufferToString(res.jobName);
        res.correlationId = startServerResp.correlationId;
      }
      this.connections.set(connectionId, res);
    } catch (err) {
      if (res.socket) {
        res.socket.end();
      }
      throw(err);
    }
    return res;
  }

  /**
   * Sign on to the system.
   */
  async signon() {
    debug('Attempt to sign on to %s as %s', this.hostName, this.userId);
    let res;

    let signonService = new SignonService(this);

    try {
      res = await signonService.signon();
      debug('Successfully signed on to %s as %s: %j', this.hostName, this.userId, res);
      this.serverCCSID = res.serverCCSID;
      this.signonPerformed = true;
    } catch (err) {
      error('Failed to signon to %s as %s: %s', this.hostName, this.userId, err);
      throw(err);
    } finally {
      signonService.disconnect();
    }
    return res;
  }

  /**
   * Start server.
   */
  async startServer(clientSeed, serverSeed, service, socket, connectionId) {
    return new Promise((resolve, reject) => {
      debug('Starting server for service %s on %s', service.name, this.hostName);
      let encryptor = new PasswordEncryptor(this.passwordLevel);
      let encryptedPassword = encryptor.encrypt(this.userId, this.password, clientSeed, serverSeed);
      let req = new StartServerRequest(this.userId, encryptedPassword, service.id);
      req.correlationId = connectionId;
      socket.once('data', this.handleStartServerResponse.bind(this, resolve, reject));
      this.sendPacket(req, socket);
    });
  }

  /**
   * Exchange random seeds.
   */
  async exchangeRandomSeeds(service, socket, connectionId) {
    return new Promise((resolve, reject) => {
      debug('Exchanging random seeds for service %s on %s with connection ID of %d', service.name, this.hostName, connectionId);
      let req = new RandomSeedExchangeRequest(service.id);
      req.correlationId = connectionId;
      socket.once('data', this.handleRandomSeedExchangeResponse.bind(this, resolve, reject, req.seed));
      this.sendPacket(req, socket);
    });
  }

  handleStartServerResponse(resolve, reject, data) {
    debug('Start server data received: %s', data.toString('hex'));
    if (data.length < 24) {
      error('Invalid start server response from %s', this.hostName);
      reject(new Error('Invalid start server response from ' + this.hostName));
    } else {
      let resp = new StartServerResponse(data);
      debug('Start server response return code from %s is %d', this.hostName, resp.rc);
      if (resp.rc !== 0) {
        error('Received error code during start server with %s: %d', this.hostName, resp.rc);
        reject(new Error('Error received during start server with ' + this.hostName + ': ' + resp.rc));
      } else {
        let res = {
          correlationId: resp.correlationId,
          jobName: resp.jobName
        };
        resolve(res);
      }
    }
  }

  handleRandomSeedExchangeResponse(resolve, reject, clientSeed, data) {
    debug('Random seed exchange data received: %s', data.toString('hex'));
    if (data.length < 24) {
      error('Invalid random seed exchange response from %s', this.hostName);
      reject(new Error('Invalid random seed exchange response from ' + this.hostName));
    } else {
      let resp = new RandomSeedExchangeResponse(data);
      debug('Random seed exchange response return code from %s is %d', this.hostName, resp.rc);
      if (resp.rc !== 0) {
        error('Received error code during start server with %s: %d', this.hostName, resp.rc);
        reject(new Error('Error received during start server with ' + this.hostName + ': ' + resp.rc));
      } else {
        let serverSeed = resp.seed;
        debug('Server seed from %s is %s, our seed is %s', this.hostName, serverSeed.toString('hex'), clientSeed.toString('hex'));
        let res = {
          serverSeed: serverSeed,
          clientSeed: clientSeed
        };
        resolve(res);
      }
    }
  }

}
