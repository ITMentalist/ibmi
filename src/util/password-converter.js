'use strict';

import cptable from 'codepage';

const debug = require('debug')('ibmi:util:password-converter');

/**
 * This class provides various conversion methods for password and user IDs.
 */
export default class PasswordConverter {

  /**
   * Converts a string to an EBCID buffer.
   * @public
   * @param {string} str - The string.
   * @returns {Buffer} The EBCID buffer.
   */
  static stringToEBCIDBuffer(str) {
    debug('Converting %s to EBCID', str);
    let encoded = cptable.utils.encode(37, str);
    let remain = 10 - encoded.length;
    let append = new Buffer(remain);
    append.fill(0x40);
    let res = Buffer.concat([encoded, append]);
    return res;
  }

  /**
   * Convert a string to a UTF8 16 BE buffer.
   */
  static stringToUTF16BEBuffer(str, trimSpace) {
    debug('Converting %s to UTF 16 BE buffer, trim = %d', str, trimSpace);
    if (trimSpace) {
      str = str.trim();
    }
    let res = cptable.utils.encode(1201, str);
    return res;
  }

  /**
   * Converts an EBCID buffer to UTF16 BE buffer.
   * @public
   * @param {Buffer} buff - The EBCID buffer.
   * @param {boolean} trimSpace - Whether or not to trim trailing space.
   * @returns {Buffer} The UTF8 16 BE buffer.
   */
  static ebcidBufferToUTF16BEBuffer(buff, trimSpace) {
    debug('Converting EBCID buffer %s to UTF 16 BE buffer, trim = %d', buff.toString('hex'), trimSpace);
    let str = cptable.utils.decode(37, buff);
    if (trimSpace) {
      str = str.trim();
    }
    let res = cptable.utils.encode(1201, str);
    return res;
  }

  /**
   * Converts a buffer to string with the given ccsid.
   */
  static bufferToStringByCCSID(buff, ccsid) {
    debug('Converting buffer %s to string with ccsid of %d', buff.toString('hex'), ccsid);
    let res = cptable.utils.decode(ccsid, buff);
    return res;
  }

  /**
   * Convert a string to buffer by ccsid.
   */
  static stringToBufferByCCSID(str, ccsid) {
    debug('Converting string %s to buffer with ccsid of %d', str, ccsid);
    let res = cptable.utils.encode(ccsid, str);
    return res;
  }

  /**
   * Converts an EBCID buffer to a string.
   * @public
   * @param {Buffer} buff - The EBCID buffer.
   * @returns {string} The string.
   */
  static ebcidBufferToString(buff) {
    debug('Converting EBCID buffer %s to string', buff.toString('hex'));
    let res = cptable.utils.decode(37, buff);
    return res.slice(0, PasswordConverter.ebcidStrLen(buff));
  }

  /**
   * Get length of an EBCID string as a buffer.
   * @public
   * @param {Buffer} buff - The EBCID buffer.
   * @returns {number} The length.
   */
  static ebcidStrLen(buff, maxLen) {
    let i = 0;
    maxLen = maxLen || buff.length;
    while ((i < maxLen) && (buff[i] != 0x40) && (buff[i] !== 0)) {
      ++i;
    }
    return i;
  }

}
