'use strict';

const debug = require('debug')('ibmi:types:text');
let error = require('debug')('ibmi:types:text:error');
error.color = 1;

/**
 * IBMi text data type.
 */
export default class Text {

  /**
   * Create a new text type of a specfic length with optional options.
   */
  constructor(length, opts) {
    if (typeof(length) != 'number') {
      throw new Error('Length must be a number');
    }
    if (length < 0) {
      throw new Error('Length must be greater than or equal to 0');
    }

    opts = opts || { };
    this.length = length;

    debug('Text type creted with length of %d', this.length);
  }

}
