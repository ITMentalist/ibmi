'use strict';

import ObjectPath from '../qsys/object-path';
import DataQueueService from '../service/data-queue-service';

const debug = require('debug')('ibmi:data-queue:data-queue');
let error = require('debug')('ibmi:data-queue:data-queue:error');
error.color = 1;

export default class DataQueue {

  /**
   * Constructor.
   */
  constructor(system, path) {
    if ((!system || !system.constructor || !system.constructor.name) || system.constructor.name != 'IBMi') {
      throw new Error('Invalid IBMi system');
    }

    if (typeof(path) != 'string') {
      throw new Error('Invalid path');
    }

    this.system = system;
    this.path = path;
    this.objectPath = new ObjectPath({path: this.path});
    this.dataQueueService = new DataQueueService(this.system);
    debug('Data queue created on %s with path %s', this.system.hostName, this.path);
  }

  /**
   * Write data out to the data queue.
   */
  async write(data, key) {
    if (!Buffer.isBuffer(data)) {
      throw new Error('Invalid data');
    }
    debug('Attempt to write %s to %s', data.toString('hex'), this.path);
    let res = await this.dataQueueService.write(this.objectPath.objectName, this.objectPath.libraryName, key, data);
    /*return new Promise((resolve, reject) => {
      if (!Buffer.isBuffer(data)) {
        reject(new Error('Invalid data'));
      } else {
        debug('Attempt to write %s to %s', data.toString('hex'), this.path);
      }
    });*/
  }

}
