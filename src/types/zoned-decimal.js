'use strict';

import DataType from './data-type';

const debug = require('debug')('ibmi:types:zoned-decimal');
let error = require('debug')('ibmi:types:zoned-decimal:error');
error.color = 1;

/**
 * IBMi zoned decimal type.
 */
export default class ZonedDecimal {

  /**
   * Constructor.
   */
  constructor(numDigits, numDecimalPositions) {
    // Range checks
    if (numDigits < 1 || numDigits > 63) {
      throw new Error('Invalid range for number of digits');
    }
    if (numDecimalPositions < 0 || numDecimalPositions > numDigits) {
      throw new Error('Invalid range for number of decimal positions');
    }

    this.digits = numDigits;
    this.scale = numDecimalPositions;
    this.type = DataType.ZONED;

    debug('Zoned decimal type created with %d digits and scale of %d', this.digits, this.scale);
  }

  toBuffer(value, opts) {
    debug('Attempt to convert %d to buffer', value);
    opts = opts || { };

    let serverValue;
    let offset = 0;

    if (!opts.serverValue) {
      serverValue = new Buffer(this.digits);
      serverValue.fill(0);
    } else {
      serverValue = opts.serverValue;
    }

    if (opts.offset) {
      offset = opts.offset;
    }

    let outDigits = this.digits;

    // First get the sign
    let sign = Math.sign(value);

    // Now get just the digits without the sign.
    let beforeDecimal = Math.trunc(Math.abs(value));
    let afterDecimal = value.toString().split('.')[1];
    let digits = beforeDecimal.toString() + afterDecimal;

    if (afterDecimal.length != this.scale) {
      throw new Error('Length is not valid');
    }

    let inChars = new Buffer(digits);
    let inLength = inChars.length;
    // Check overall length
    if (inLength > outDigits) {
      throw new Error('Length is not valid');
    }

    let inPosition = 0;

    // Write correct number of leading zeros
    for (let i = 0; i < outDigits - inLength; ++i) {
      serverValue[offset++] = 0xF0;
    }

    // Place all the digits except the last one
    while (inPosition < inChars.length - 1) {
      serverValue[offset++] = (inChars[inPosition++] & 0x000F) | 0x00F0;
    }

    // Place the sign and last digit
    if (sign != -1) {
      serverValue[offset] = (inChars[inPosition] & 0x000F) | 0x00F0;
    } else {
      serverValue[offset] = (inChars[inPosition] & 0x000F) | 0x00D0;
    }
    return serverValue;
  }

  get length() {
    return this.digits;
  }

}
