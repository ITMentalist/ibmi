'use strict';

import DataType from './data-type';
import BinaryConverter from './binary-converter';

const debug = require('debug')('ibmi:types:float8');
let error = require('debug')('ibmi:types:float8:error');
error.color = 1;

export default class Float8 {

  constructor() {
    this.type = DataType.FLOAT8;
    debug('Created float8 type');
  }

  toBuffer(value, opts) {
    debug('Attempt to convert %d to buffer', value);

    opts = opts || { };

    let serverValue;
    let offset = 0;

    if (!opts.serverValue) {
      serverValue = new Buffer(8);
      serverValue.fill(0);
    } else {
      serverValue = opts.serverValue;
    }

    if (opts.offset) {
      offset = opts.offset;
    }

    let b = BinaryConverter.doubleToBuffer(value);
    b.copy(serverValue, offset, 0, b.length);

    return serverValue;
  }

  get length() {
    return 8;
  }

}
