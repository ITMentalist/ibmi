'use strict';

import DataType from './data-type';

const debug = require('debug')('ibmi:types:byte-array');
let error = require('debug')('ibmi:types:byte-array:error');
error.color = 1;

export default class ByteArray {

  constructor(length) {
    this.length = length;
    this.type = DataType.BYTE_ARRAY;

    debug('Byte array created with length of %d', this.length);
  }

  toBuffer(value, opts) {
    debug('Attempt to convert %s to buffer', value.toString('hex'));

    opts = opts || { };
    let serverValue;
    let offset = 0;

    if (!opts.serverValue) {
      serverValue = new Buffer(this.length);
      serverValue.fill(0);
    } else {
      serverValue = opts.serverValue;
    }

    if (opts.offset) {
      offset = opts.offset;
    }

    value.copy(serverValue, offset, 0, value.length);

    return serverValue;
  }

}
