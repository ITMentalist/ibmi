'use strict';

const debug = require('debug')('ibmi:types:bidi');

const ST10 = 10;

const bidiTable = new Map();
bidiTable.set(13488, ST10);
bidiTable.set(61952, ST10);

/**
 * BIDI transformer.
 */
export default class Bidi {

  /**
   * Check to see if the specified CCSID is BIDI.
   */
  static isBidiCcsid(ccsid) {
    debug('Check if CCSID %d is BIDI', ccsid);
    if (bidiTable.get(ccsid)) {
      return true;
    } else {
      return false;
    }
  }

  static get ST10() {
    return ST10;
  }

  static get BIDI_TABLE() {
    return bidiTable;
  }

}
