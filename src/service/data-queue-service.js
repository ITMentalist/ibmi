'use strict';

import Service from './service';
import Packet from '../packet/packet';
import { DataQueueExchangeAttributesRequest, DataQueueExchangeAttributesResponse } from '../packet/data-queue-exchange-attributes';
import { DataQueueWriteRequest } from '../packet/data-queue-write';
import { DataQueueCreateRequest } from '../packet/data-queue-create';
import { DataQueueDeleteRequest } from '../packet/data-queue-delete';
import { DataQueueClearRequest } from '../packet/data-queue-clear';
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

  create(name, library, entryLength, authority, saveSenderInfo, fifo, keyLength, forceStorage, description) {
    return new Promise((resolve, reject) => {
      debug('Attempting to create %s/%s on %s', library, name, this.system.hostName);
      this.open().then(() => {
        name = this.convertString(name, 10);
        library = this.convertString(library, 10);
        description = this.convertString(description, 50);
        let req = new DataQueueCreateRequest(name, library, entryLength, authority, saveSenderInfo, fifo, keyLength, forceStorage, description);
        this.socket.once('data', this.handleCreateResponse.bind(this, resolve, reject));
        this.sendPacket(req);
      }).catch((err) => {
        error('Failed to create: %s', err);
        reject(err);
      });
    });
  }

  clear(name, library, key) {
    return new Promise((resolve, reject) => {
      debug('Attempting to clear %s/%s on %s', library, name, this.system.hostName);
      this.open().then(() => {
        name = this.convertString(name, 10);
        library = this.convertString(library, 10);
        let req = new DataQueueClearRequest(name, library, key);
        this.socket.once('data', this.handleClearResponse.bind(this, resolve, reject));
        this.sendPacket(req);
      }).catch((err) => {
        error('Failed to clear: %s', err);
        reject(err);
      });
    });
  }

  delete(name, library) {
    return new Promise((resolve, reject) => {
      debug('Attempting to delete %s/%s on %s', library, name, this.system.hostName);
      this.open().then(() => {
        name = this.convertString(name, 10);
        library = this.convertString(library, 10);
        let req = new DataQueueDeleteRequest(name, library);
        this.socket.once('data', this.handleDeleteResponse.bind(this, resolve, reject));
        this.sendPacket(req);
      }).catch((err) => {
        error('Failed to delete: %s', err);
        reject(err);
      });
    });
  }

  write(name, library, key, data) {
    return new Promise((resolve, reject) => {
      debug('Attempting to write %s with key %s to %s/%s on %s', data.toString('hex'), key, library, name, this.system.hostName);
      this.open().then(() => {
        name = this.convertString(name, 10);
        library = this.convertString(library, 10);
        let req = new DataQueueWriteRequest(name, library, key, data);
        this.socket.once('data', this.handleWriteResponse.bind(this, resolve, reject));
        this.sendPacket(req);
      }).catch((err) => {
        error('Failed to write: %s', err);
        reject(err);
      });
    });
  }

  read(name, library, search, wait, peek, key) {
    return new Promise((resolve, reject) => {
      debug('Attempting to read from %s/%s on %s', library, name, this.system.hostName);
      this.open().then(() => {
        name = this.convertString(name, 10);
        library = this.convertString(library, 10);
      }).catch((err) => {
        error('Failed to read: %s', err);
        reject(err);
      });
    });
  }

  convertString(str, len) {
    let b = this.converter.stringToBuffer(str);
    let res = new Buffer(len);
    res.fill(0x40);
    b.copy(res, 0, 0, len);
    return res;
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

  handleCreateResponse(resolve, reject, data) {
    debug('Create response received from %s: %s', this.system.hostName, data.toString('hex'));
    if (data.length < 22) {
      error('Invalid create response received from %s', this.system.hostName);
      reject(new Error('Invalid create response received from ' + this.system.hostName));
    } else {
      let resp = new Packet(data);
      debug('Create request response ID: %s', resp.requestResponseId.toString(16));
      if (resp.requestResponseId == DataQueueReturnCodeResponse.ID) {
        debug('Data queue return code response received from %s', this.system.hostName);
        resp = new DataQueueReturnCodeResponse(data);
        if (resp.rc != 0xF000) {
          error('Create failed with code %d from %s with message of %s', resp.rc, this.system.hostName, this.converter.bufferToString(resp.message));
          reject(new Error('Create failed with code ' + resp.rc + ' from ' + this.system.hostName + ' with message of ' + this.converter.bufferToString(resp.message)));
        } else {
          debug('Create to %s succeeded', this.system.hostName);
          resolve(true);
        }
      } else {
        error('Invalid create response ID received from %s', this.system.hostName);
        reject(new Error('Invalid create response ID received from ' + this.system.hostName));
      }
    }
  }

  handleClearResponse(resolve, reject, data) {
    debug('Clear response received from %s: %s', this.system.hostName, data.toString('hex'));
    if (data.length < 22) {
      error('Invalid clear response received from %s', this.system.hostName);
      reject(new Error('Invalid clear response received from ' + this.system.hostName));
    } else {
      let resp = new Packet(data);
      debug('Clear request response ID: %s', resp.requestResponseId.toString(16));
      if (resp.requestResponseId == DataQueueReturnCodeResponse.ID) {
        debug('Data queue return code response received from %s', this.system.hostName);
        resp = new DataQueueReturnCodeResponse(data);
        if (resp.rc != 0xF000) {
          error('Clear failed with code %d from %s with message of %s', resp.rc, this.system.hostName, this.converter.bufferToString(resp.message));
          reject(new Error('Clear failed with code ' + resp.rc + ' from ' + this.system.hostName + ' with message of ' + this.converter.bufferToString(resp.message)));
        } else {
          debug('Clear to %s succeeded', this.system.hostName);
          resolve(true);
        }
      } else {
        error('Invalid clear response ID received from %s', this.system.hostName);
        reject(new Error('Invalid clear response ID received from ' + this.system.hostName));
      }
    }
  }

  handleDeleteResponse(resolve, reject, data) {
    debug('Delete response received from %s: %s', this.system.hostName, data.toString('hex'));
    if (data.length < 22) {
      error('Invalid delete response received from %s', this.system.hostName);
      reject(new Error('Invalid delete response received from ' + this.system.hostName));
    } else {
      let resp = new Packet(data);
      debug('Delete request response ID: %s', resp.requestResponseId.toString(16));
      if (resp.requestResponseId == DataQueueReturnCodeResponse.ID) {
        debug('Data queue return code response received from %s', this.system.hostName);
        resp = new DataQueueReturnCodeResponse(data);
        if (resp.rc != 0xF000) {
          error('Deelete failed with code %d from %s with message of %s', resp.rc, this.system.hostName, this.converter.bufferToString(resp.message));
          reject(new Error('Delete failed with code ' + resp.rc + ' from ' + this.system.hostName + ' with message of ' + this.converter.bufferToString(resp.message)));
        } else {
          debug('Delete to %s succeeded', this.system.hostName);
          resolve(true);
        }
      } else {
        error('Invalid delete response ID received from %s', this.system.hostName);
        reject(new Error('Invalid delete response ID received from ' + this.system.hostName));
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
      debug('Write request response ID: %s', resp.requestResponseId.toString(16));
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
