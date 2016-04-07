'use strict';

import Int64 from 'int64-native';

const debug = require('debug')('ibmi:types:binary-converter');
let error = require('debug')('ibmi:types:binary-converter:error');
error.color = 1;

/**
 * Binary converter.
 */
export default class BinaryConverter {

  static shortToBuffer(value) {
    debug('Attempt to convert short %d to buffer', value);
    let b = new Buffer(2);
    b.fill(0);
    b.writeInt16BE(value, 0);
    return b;
  }

  static unsignedShortToBuffer(value) {
    debug('Attempt to convert unsigned short %d to buffer', value);
    let b = new Buffer(2);
    b.fill(0);
    b.writeUInt16BE(value, 0);
    return b;
  }

  static intToBuffer(value) {
    debug('Attempt to convert int %d to buffer', value);
    let b = new Buffer(4);
    b.fill(0);
    b.writeInt32BE(value, 0);
    return b;
  }

  static unsignedIntToBuffer(value) {
    debug('Attempt to convert unsigned int %d to buffer', value);
    let b = new Buffer(4);
    b.fill(0);
    b.writeUInt32BE(value, 0);
    return b;
  }

  static longToBuffer(value) {
    debug('Attempt to convert long %d to buffer', value);
    let b = new Buffer(8);
    b.fill(0);
    let int64 = new Int64(value);
    let high = int64.high32();
    let low = int64.low32();

    b[0] = high >>> 24;
    b[1] = high >>> 16;
    b[2] = high >>> 8;
    b[3] = high;

    b[4] = low >>> 24;
    b[5] = low >>> 16;
    b[6] = low >>> 8;
    b[7] = low;

    return b;
  }

  static floatToBuffer(value) {
    debug('Attempt to convert float %d to buffer', value);
    let b = new Buffer(4);
    b.fill(0);
    b.writeFloatBE(value, 0);
    return b;
  }

  static doubleToBuffer(value) {
    debug('Attempt to convert double %d to buffer', value);
    let b = new Buffer(8);
    b.fill(0);
    b.writeDoubleBE(value, 0);
    return b;
  }

}
