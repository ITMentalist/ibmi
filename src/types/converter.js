'use strict';

import Environment from '../util/environment';
import cptable from 'codepage';

const debug = require('debug')('ibmi:types:converter');

const ccsidMap = new Map();
ccsidMap.set(37, 37);
ccsidMap.set(1200, 1200);
ccsidMap.set(13488, 1200);
ccsidMap.set(61952, 1200);

/**
 * A converter to convert strings to native code pages.
 */
export default class Converter {

  /**
   * Constructor.
   * @constructor
   */
  constructor(opts) {
    opts = opts || { };

    this.ccsid = opts.ccsid;
    if (!this.ccsid) {
      this.ccsid = Environment.getCcsid();
    }
    debug('Converter created with CCSID of %d', this.ccsid);
  }

  /**
   * String to buffer.
   */
  stringToBuffer(str) {
    let cp = ccsidMap.get(this.ccsid);
    debug('Attempt to convert string %s to buffer with CCSID %d and codepage %d', str, this.ccsid, cp);
    return cptable.utils.encode(cp, str);
  }

  /**
   * Buffer to string.
   */
  bufferToString(buff) {
    if (buff) {
      let cp = ccsidMap.get(this.ccsid);
      debug('Attempt to convert buffer %s to string with CCSID %d and codepage %d', buff.toString('hex'), this.ccsid, cp);
      return cptable.utils.decode(cp, buff);
    } else {
      return null;
    }
  }

}
