'use strict';

import DataType from './data-type';
import Converter from './converter';

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
    this.ccsid = 65535;
    this.type = DataType.TEXT;
    this.padding = null;

    if (opts.ccsid) {
      this.ccsid = opts.ccsid;
    }

    debug('Text type created with length of %d and CCSID of %d', this.length, this.ccsid);
  }

  /**
   * Convert string to buffer.
   */
  toBuffer(str, opts) {
    debug('Attempt to convert %s to buffer', str);
    opts = opts || { };

    let serverValue;
    let offset = 0;
    if (opts.offset) {
      offset = opts.offset;
    }

    // First set converter
    this.setConverter();

    // Next, validate length
    if (str.length > this.length) {
      throw new Error('Length is not valid');
    }

    // Now pad our input string to length
    for (let i = str.length; i < this.length; i++) {
      str += ' ';
    }

    // Now run conversion
    let converted = this.converter.stringToBuffer(str);

    // Copy into server value
    if (opts.serverValue) {
      serverValue = opts.serverValue;
      converted.copy(serverValue, offset, 0, converted.length);
    } else {
      serverValue = new Buffer(this.length);
      serverValue.fill(0);
      converted.copy(serverValue, offset, 0, converted.length);
    }

    return serverValue;
  }

  /**
   * Set converter.
   */
  setConverter() {
    if (this.ccsid == 65535) {
      this.converter = new Converter();
      this.ccsid = this.converter.ccsid;
    } else {
      this.converter = new Converter({ ccsid: this.ccsid });
    }
    debug('CCSID is now %d', this.ccsid);
  }

}
