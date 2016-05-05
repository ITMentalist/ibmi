'use strict';

import DataQueueService from '../../../src/service/data-queue-service';
import SecurityErrors from '../../../src/errors/security-errors';
import Packet from '../../../src/packet/packet';
import { RandomSeedExchangeRequest, RandomSeedExchangeResponse } from '../../../src/packet/random-seed-exchange';
import { StartServerRequest, StartServerResponse } from '../../../src/packet/start-server';
import { DataQueueExchangeAttributesRequest, DataQueueExchangeAttributesResponse } from '../../../src/packet/data-queue-exchange-attributes';
import { DataQueueWriteRequest } from '../../../src/packet/data-queue-write';
import { DataQueueCreateRequest } from '../../../src/packet/data-queue-create';
import DataQueueReturnCodeResponse from '../../../src/packet/data-queue-return-code';
import PasswordConverter from '../../../src/util/password-converter';

const debug = require('debug')('ibmi:mock:server:data-queue');

import net from 'net';
import crypto from 'crypto';

export default class DataQueue {

  constructor() {
    this.connections = new Map();
    this.port = 8472;
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
      if (packet.requestResponseId == RandomSeedExchangeRequest.ID) {
        this.handleRandomSeedExchange(socket, packet);
      } else if (packet.requestResponseId == StartServerRequest.ID) {
        this.handleStartServer(socket, packet);
      } else if (packet.requestResponseId == 0 && packet.length == 26) {
        this.handleExchangeAttributes(socket, packet);
      } else if (packet.requestResponseId == DataQueueWriteRequest.ID) {
        this.handleWrite(socket, packet);
      } else if (packet.requestResponseId == DataQueueCreateRequest.ID) {
        this.handleCreate(socket, packet);
      }
    });
  }

  handleRandomSeedExchange(socket, req) {
    debug('Handling random seed exchange');
    let clientSeed = req.data.slice(20);
    debug('Client seed: %s', clientSeed.toString('hex'));
    // Generate and store seed associated with this client
    let seed = crypto.randomBytes(8);
    debug('Generated seed: %s', seed.toString('hex'));
    let resp = new RandomSeedExchangeResponse();
    resp.seed = seed;
    resp.correlationId = req.correlationId;
    debug('Random seed exchange response: %s', resp.data.toString('hex'));
    socket.write(resp.data);
  }

  handleStartServer(socket, req) {
    debug('Handling start server');
    let userId = PasswordConverter.ebcidBufferToString(req.getField(StartServerRequest.USERID));
    debug('User ID is: %s', userId);
    let password = req.getField(StartServerRequest.PASSWORD);
    debug('Password is: %s', password.toString('hex'));
    if (userId == 'USER') {
      let resp = new StartServerResponse();
      resp.rc = 0;
      resp.correlationId = req.correlationId;
      resp.userId = userId;
      resp.serviceId = DataQueueService.SERVICE.id;
      resp.jobName = new Buffer('00000000f8f3f4f6f7f761d8e4e2c5d961d8e9d9c3e2d9e5e2', 'hex');
      debug('Start server response: %s', resp.data.toString('hex'));
      socket.write(resp.data);
    } else {
      let resp = new StartServerResponse();
      debug('Unknown user');
      resp.rc = SecurityErrors.USERID_UNKNOWN.id;
      resp.correlationId = req.correlationId;
      resp.serviceId = DataQueueService.SERVICE.id;
      debug('Start server response: %s', resp.data.toString('hex'));
      socket.write(resp.data);
    }
  }

  handleExchangeAttributes(socket, req) {
    debug('Handling exchange attributes');
    let resp = new DataQueueExchangeAttributesResponse();
    resp.correlationId = req.correlationId;
    debug('Exchange attributes response: %s', resp.data.toString('hex'));
    socket.write(resp.data);
  }

  handleWrite(socket, req) {
    debug('Handling write');
    let queue = req.data.slice(20, 30);
    let library = req.data.slice(30, 40);
    let resp = new DataQueueReturnCodeResponse();
    if (queue.toString('hex') == 'e2d6d4c5d8e4c5e4c540') {
      resp.rc = 0xF000;
      resp.correlationId = req.correlationId;
      socket.write(resp.data);
    } else {
      resp.rc = 1;
      resp.correlationId = req.correlationId;
      socket.write(resp.data);
    }
  }

  handleCreate(socket, req) {
    debug('Handling create');
    let queue = req.data.slice(20, 30);
    let library = req.data.slice(30, 40);
    let resp = new DataQueueReturnCodeResponse();
    console.log(queue.toString('hex'));
    if (queue.toString('hex') == 'e2d6d4c5d8e4c5e4c540') {
      resp.rc = 0xF000;
      resp.correlationId = req.correlationId;
      socket.write(resp.data);
    } else {
      resp.rc = 1;
      resp.correlationId = req.correlationId;
      socket.write(resp.data);
    }
  }

}
