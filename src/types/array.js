'use strict';

import DataType from './data-type';

const debug = require('debug')('ibmi:types:array');
let error = require('debug')('ibmi:types:array:error');
error.color = 1;

export default class IArray {

  /**
   * Constructor.
   */
  constructor(type, size) {
    if (size < 0) {
      throw new Error('Size must be greater than or equal to 0');
    }

    this.size = size;
    this.arrayType = type;
    this.type = DataType.ARRAY;

    debug('Array created with size of %d and type of %d', this.size, this.arrayType.type);
  }

  toBuffer(value, opts) {
    debug('Attempt to convert %j to buffer', value);

    if (value.length != this.size) {
      throw new Error('Length is not valid');
    }

    opts = opts || { };
    let serverValue;
    let offset = 0;
    let element = this.arrayType;

    if (!opts.serverValue) {
      serverValue = new Buffer(this.length);
      serverValue.fill(0);
    } else {
      serverValue = opts.serverValue;
    }

    if (opts.offset) {
      offset = opts.offset;
    }

    for (let i = 0; i < this.size; i++) {
      let b = element.toBuffer(value[i]);
      b.copy(serverValue, offset, 0, b.length);
      offset += b.length;
    }

    return serverValue;
  }

  get length() {
    let res = 0;
    for (let i = 0; i < this.size; i++) {
      res += this.arrayType.length;
    }
    return res;
  }

}
