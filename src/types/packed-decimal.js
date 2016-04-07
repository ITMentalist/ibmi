'use strict';

import DataType from './data-type';

const debug = require('debug')('ibmi:types:packed-decimal');
let error = require('debug')('ibmi:types:packed-decimal:error');
error.color = 1;

/**
 * IBMi packed decimal type.
 */
export default class PackedDecimal {

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
    this.type = DataType.PACKED;

    debug('Packed decimal type created with %d digits and scale of %d', this.digits, this.scale);
  }

  /**
   * Convert value to buffer.
   */
  toBuffer(value, opts) {
    debug('Attempt to convert %d to buffer', value);
    opts = opts || { };

    let serverValue;
    let offset = 0;

    if (!opts.serverValue) {
      serverValue = new Buffer(this.digits / 2+1);
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

    let inChars = new Buffer(digits);
    let inLength = inChars.length;
    // Check overall length
    if (inLength > outDigits) {
      throw new Error('Length is not valid');
    }

    let inPosition = 0;

    // Calculate number of leading zeros
    let leadingZeros = (outDigits % 2 == 0) ? (outDigits - inLength + 1) : (outDigits - inLength);

    // Write leading zeros
    for (let i = 0; i < leadingZeros-1; i+=2) {
      serverValue[offset++] = 0;
    }

    // If odd number of leading zeros, write leading zero and first digit
    if (leadingZeros > 0) {
      if (leadingZeros % 2 != 0) {
        serverValue[offset++] = inChars[inPosition++] & 0x000F;
      }
    }

    let firstNibble;
    let secondNibble;
    // Place all the digits except last one
    while (inPosition < inChars.length-1) {
      firstNibble = (inChars[inPosition++] & 0x000F) << 4;
      secondNibble = inChars[inPosition++] & 0x000F;
      serverValue[offset++] = firstNibble + secondNibble;
    }

    // Place last digit and sign nibble
    firstNibble = (inChars[inPosition++] & 0x000F) << 4;
    if (sign != -1) {
      serverValue[offset++] = firstNibble + 0x000F;
    } else {
      serverValue[offset++] = firstNibble + 0x000D;
    }
    return serverValue;
  }

  get length() {
    return Math.floor(this.digits / 2) + 1;
  }

}
