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
   * Create a data queue.
   */
  async create(entryLength, opts) {
    let res = null;
    try {
      opts = opts || {
        authority: '*LIBCRTAUT',
        saveSenderInfo: false,
        fifo: true,
        keyLength: 0,
        forceStorage: false,
        description: 'Queue'
      };
      debug('Attempt to create data queue at path %s with length of %d', this.path, entryLength);
      res = await this.dataQueueService.create(this.objectPath.objectName, this.objectPath.libraryName, entryLength,
                                               opts.authority, opts.saveSenderInfo, opts.fifo, opts.keyLength,
                                               opts.forceStorage, opts.description);
    } catch (err) {
      error('Failed to create %s with opts %j', this.path, opts);
      throw new Error('Failed to create ' + this.path);
    }
    return res;
  }

  /**
   * Write data out to the data queue.
   */
  async write(data, key) {
    let res = null;
    try {
      debug('Attempt to write %s to %s', data.toString('hex'), this.path);
      res = await this.dataQueueService.write(this.objectPath.objectName, this.objectPath.libraryName, key, data);
    } catch (err) {
      error('Failed to write to %s, %s', this.path, err);
      throw(new Error('Failed to write to ' + this.path + ', ' + err));
    }
    return res;
  }

  /**
   * Clear the data queue.
   */
  async clear(key) {
    let res = null;
    try {
      debug('Attempt to clear %s', this.path);
      res = await this.dataQueueService.clear(this.objectPath.objectName, this.objectPath.libraryName, key);
    } catch (err) {
      error('Failed to clear %s, %s', this.path, err);
      throw(new Error('Failed to clear ' + this.path + ', ' + err));
    }
    return res;
  }

  /**
   * Delete a data queue.
   */
  async delete() {
    let res = null;
    try {
      debug('Attempt to delete %s', this.path);
      res = await this.dataQueueService.delete(this.objectPath.objectName, this.objectPath.libraryName);
    } catch (err) {
      error('Failed to delete %s, %s', this.path, err);
      throw(new Error('Failed to delete ' + this.path + ', ' + err));
    }
    return res;
  }

}
