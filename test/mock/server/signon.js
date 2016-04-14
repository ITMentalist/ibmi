'use strict';

const debug = require('debug')('ibmi:mock:server:signon');

import SecurityErrors from '../../../src/errors/security-errors';
import Packet from '../../../src/packet/packet';
import { SignonSeedExchangeRequest, SignonSeedExchangeResponse } from '../../../src/packet/signon-seed-exchange';
import { SignonInfoRequest, SignonInfoResponse } from '../../../src/packet/signon-info';
import PasswordConverter from '../../../src/util/password-converter';

import net from 'net';
import crypto from 'crypto';

export default class Signon {

  constructor() {
    this.connections = new Map();
    this.port = 8476;
  }

  async start() {
    debug('Starting');
    await this.listen();
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

  handleConnection(socket) {
    let key = socket.remoteAddress + ':' + socket.remotePort;
    debug('New connection with key %s', key);
    this.connections.set(key, socket);
    socket.on('close', () => {
      this.connections.delete(key);
    });
    socket.on('data', (data) => {
      debug('Received data: %s', data.toString('hex'));
      let packet = new Packet(data);
      debug('Request/response ID: %d', packet.requestResponseId.toString(16));
      if (packet.requestResponseId == SignonSeedExchangeRequest.ID) {
        this.handleSeedExchange(socket, packet);
      } else if (packet.requestResponseId == SignonInfoRequest.ID) {
        this.handleInfo(socket, packet);
      }
    });
  }

  handleSeedExchange(socket, req) {
    debug('Handling seed exchange');
    let clientSeed = req.getField(SignonSeedExchangeRequest.CLIENT_SEED);
    debug('Client seed: %s', clientSeed.toString('hex'));
    let seed = crypto.randomBytes(8);
    debug('Generated seed: %s', seed.toString('hex'));
    let resp = new SignonSeedExchangeResponse();
    resp.serverVersion = 7340545;
    resp.serverLevel = 10;
    resp.passwordLevel = 0;
    resp.serverSeed = seed;
    resp.jobName = crypto.randomBytes(25);
    resp.correlationId = req.correlationId;
    debug('Seed exchange response: %s', resp.data.toString('hex'));
    socket.write(resp.data);
  }

  handleInfo(socket, req) {
    debug('Handling info');
    let userId = PasswordConverter.ebcidBufferToString(req.getField(SignonInfoRequest.USERID));
    debug('User ID: %s', userId);
    // We only know about user 'USER'
    if (userId == 'USER') {
      let resp = new SignonInfoResponse();
      resp.correlationId = req.correlationId;
      let today = new Date();
      resp.currentSignonDate = today;
      resp.lastSignonDate = today;
      resp.passwordExpirationDate = new Date(today.getTime() + 60 *24*60*60*1000);
      resp.expirationWarning = 7;
      resp.serverCCSID = 37;
      resp.rc = 0;
      resp.userId = userId;
      debug('Info response: %s', resp.data.toString('hex'));
      socket.write(resp.data);
    } else {
      let resp = new SignonInfoResponse();
      resp.rc = SecurityErrors.USERID_UNKNOWN.id;
      resp.correlationId = req.correlationId;
      debug('Info response: %s', resp.data.toString('hex'));
      socket.write(resp.data);
    }
  }

}
