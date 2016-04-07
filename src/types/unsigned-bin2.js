'use strict';

import DataType from './data-type';
import BinaryConverter from './binary-converter';

const debug = require('debug')('ibmi:types:unsigned-bin2');
let error = require('debug')('ibmi:types:unsigned-bin2:error');
error.color = 1;

/**
 * IBMi unsigned short type.
 */
export default class UnsignedBin2 {

  constructor() {
    this.type = DataType.UBIN2;
    debug('Created unsigned bin2 type');
  }

  toBuffer(value, opts) {
    debug('Attempt to convert %d to buffer', value);

    opts = opts || { };

    let serverValue;
    let offset = 0;

    if (!opts.serverValue) {
      serverValue = new Buffer(2);
      serverValue.fill(0);
    } else {
      serverValue = opts.serverValue;
    }

    if (opts.offset) {
      offset = opts.offset;
    }

    let b = BinaryConverter.unsignedShortToBuffer(value);
    b.copy(serverValue, offset, 0, b.length);

    return serverValue;
  }

  get length() {
    return 2;
  }

}
