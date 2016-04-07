'use strict';

const debug = require('debug')('ibmi:util:environment');

// Locale -> CCCIS map
const localeCcsidMap = new Map();
localeCcsidMap.set('en', 37);

/**
 * Get certain information from execution environment.
 */
export default class Environment {

  /**
   * Attempt to get CCSID from locale.
   */
  static getCcsid() {
    let locale = process.env.LANG;
    let ccsid;

    debug('Attempt to get CCSID from locale of %s', locale);
    debug(localeCcsidMap);

    // Search from most specific to most general.
    let searching = true;
    while (searching) {
      ccsid = localeCcsidMap.get(locale);

      if (ccsid) {
        searching = false;
      } else {
        locale = locale.substring(0, locale.lastIndexOf('_'));
        if (locale.length == 0) {
          searching = false;
        } else {
          debug('Locale to search is now %s', locale);
        }
      }
    }

    // Default US EN EBCID
    if (!ccsid) {
      ccsid = 37;
    }

    return ccsid;
  }

}
