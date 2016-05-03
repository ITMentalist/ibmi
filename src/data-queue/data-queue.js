'use strict';

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
    debug('Data queue created on %s with path %s', this.system.hostName, this.path);
  }

  /**
   * Write data out to the data queue.
   */
  write(data) {
    return new Promise((resolve, reject) => {
      if (!Buffer.isBuffer(data)) {
        reject(new Error('Invalid data'));
      } else {
        debug('Attempt to write %s to %s', data.toString('hex'), this.path);
      }
    });
  }

}
