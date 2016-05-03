'use strict';

import Service from './service';
import Packet from '../packet/packet';
import { DataQueueExchangeAttributesRequest, DataQueueExchangeAttributesResponse } from '../packet/data-queue-exchange-attributes';
import DataQueueReturnCodeResponse from '../packet/data-queue-return-code';

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
      if (!this.attributesExchanged) {
        await this.exchangeAttributes();
      }
    } catch (err) {
      error('Failed to open: %s', err);
      this.disconnect();
      throw(err);
    }
  }

  async write(key, data) {
    try {
      if (!Buffer.isBuffer(data)) {
        throw new Error('Invalid data');
      }
      debug('Attempting to write %s with key %s to %s', data.toString('hex'), key, this.system.hostName);
      await this.open();
    } catch (err) {
      error('Failed to write: %s', err);
      throw(err);
    }
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
        error('Data queue return code is %d, message is %s', resp.rc, resp.message);
        reject(new Error('Error received during attribute exchange with ' + this.system.hostName + ': ' + resp.rc));
      } else if (resp.requestResponseId == DataQueueExchangeAttributesResponse.ID) {
        debug('Attributes exchanged with %s', this.system.hostName);
        resolve(true);
      } else {
        error('Invalid exchange attributes response ID received from %s', this.system.hostName);
        reject(new Error('Invalid exchange attributes response ID received from ' + this.system.hostName));
      }
    }
  }

}
