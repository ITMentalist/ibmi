'use strict';

import Service from './service';
import Packet from '../packet/packet';
import { DataQueueExchangeAttributesRequest, DataQueueExchangeAttributesResponse } from '../packet/data-queue-exchange-attributes';
import { DataQueueWriteRequest } from '../packet/data-queue-write';
import DataQueueReturnCodeResponse from '../packet/data-queue-return-code';
import Converter from '../types/converter';

const debug = require('debug')('ibmi:service:data-queue-service');
let error = require('debug')('ibmi:service:data-queue-service:error');
error.color = 1;

export default class DataQueueService extends Service {

  static get SERVICE() {
    return {
      name: 'as-dtaq',
      id: 0xE007,
      defaultPort: 8472,
      defaultTLSPort: 9472
    };
  }

  /**
   * Constructor.
   * @constructor
   */
  constructor(system) {
    super(system, DataQueueService.SERVICE);
    this.attributesExchanged = false;
    debug('Data queue service created to %s with connection ID %d, service = %j', this.system.hostName, this.connectionId, DataQueueService.SERVICE);
  }

  async open() {
    try {
      this.connection = await this.connect();
      this.converter = new Converter(this.system.ccsid);
      if (!this.attributesExchanged) {
        await this.exchangeAttributes();
      }
    } catch (err) {
      error('Failed to open: %s', err);
      this.disconnect();
      throw(err);
    }
  }

  write(name, library, key, data) {
    return new Promise((resolve, reject) => {
      debug('Attempting to write %s with key %s to %s/%s on %s', data.toString('hex'), key, library, name, this.system.hostName);
      this.open().then(() => {
        let nameAndLibrary = this.convertNameAndLibrary(name, library);
        let req = new DataQueueWriteRequest(nameAndLibrary.name, nameAndLibrary.library, key, data);
        this.socket.once('data', this.handleWriteResponse.bind(this, resolve, reject));
        this.sendPacket(req);
      }).catch((err) => {
        error('Failed to write: %s', err);
        reject(err);
      });
    });
  }

  convertNameAndLibrary(_name, _library) {
    let b = this.converter.stringToBuffer(_name);
    let name = new Buffer(10);
    name.fill(0x40);
    b.copy(name, 0, 0, 10);
    b = this.converter.stringToBuffer(_library);
    let library = new Buffer(10);
    library.fill(0x40);
    b.copy(library, 0, 0, 10);
    return {
      name: name,
      library: library
    };
  }

  exchangeAttributes() {
    return new Promise((resolve, reject) => {
      debug('Attempting to exchange attributes with %s', this.system.hostName);
      let req = new DataQueueExchangeAttributesRequest();
      req.correlationId = this.connectionId;
      this.socket.once('data', this.handleExchangeAttributesResponse.bind(this, resolve, reject));
      this.sendPacket(req);
    });
  }

  handleExchangeAttributesResponse(resolve, reject, data) {
    debug('Exchange attributes response received from %s: %s', this.system.hostName, data.toString('hex'));
    if (data.length < 22) {
      error('Invalid exchange attributes response received from %s', this.system.hostName);
      reject(new Error('Invalid exchange attributes response received from ' + this.system.hostName));
    } else {
      let resp = new Packet(data);
      debug('Exchange attributes request response ID: %s', resp.requestResponseId.toString(16));
      if (resp.requestResponseId == DataQueueReturnCodeResponse.ID) {
        debug('Data queue return code response received from %s', this.system.hostName);
        resp = new DataQueueReturnCodeResponse(data);
        error('Data queue return code is %d, message is %s', resp.rc, this.converter.bufferToString(resp.message));
        reject(new Error('Error received during attribute exchange with ' + this.system.hostName + ': ' + resp.rc + ' message is ' + this.converter.bufferToString(resp.message)));
      } else if (resp.requestResponseId == DataQueueExchangeAttributesResponse.ID) {
        debug('Attributes exchanged with %s', this.system.hostName);
        resolve(true);
      } else {
        error('Invalid exchange attributes response ID received from %s', this.system.hostName);
        reject(new Error('Invalid exchange attributes response ID received from ' + this.system.hostName));
      }
    }
  }

  handleWriteResponse(resolve, reject, data) {
    debug('Write response received from %s: %s', this.system.hostName, data.toString('hex'));
    if (data.length < 22) {
      error('Invalid write response received from %s', this.system.hostName);
      reject(new Error('Invalid write response received from ' + this.system.hostName));
    } else {
      let resp = new Packet(data);
      debug('Exchange attributes request response ID: %s', resp.requestResponseId.toString(16));
      if (resp.requestResponseId == DataQueueReturnCodeResponse.ID) {
        debug('Data queue return code response received from %s', this.system.hostName);
        resp = new DataQueueReturnCodeResponse(data);
        if (resp.rc != 0xF000) {
          error('Write failed with code %d from %s with message of %s', resp.rc, this.system.hostName, this.converter.bufferToString(resp.message));
          reject(new Error('Write failed with code ' + resp.rc + ' from ' + this.system.hostName + ' with message of ' + this.converter.bufferToString(resp.message)));
        } else {
          debug('Write to %s succeeded', this.system.hostName);
          resolve(true);
        }
      } else {
        error('Invalid write response ID received from %s', this.system.hostName);
        reject(new Error('Invalid write response ID received from ' + this.system.hostName));
      }
    }
  }

}
