'use strict';

import Service from './service';

const debug = require('debug')('ibmi:service:database-service');
let error = require('debug')('ibmi:service:database-service:error');
error.color = 1;

export default class DatabaseService extends Service {

  static get SERVICE() {
    return {
      name: 'as-database',
      id: 0xE004,
      defaultPort: 8471,
      defaultTLSPort: 9471
    };
  }

  /**
   * Constructor.
   * @constructor
   */
  constructor(system) {
    super(system, DatabaseService.SERVICE);
    this.attributesExchanged = false;
    debug('Database service created to %s with connection ID %d, service = %j', this.system.hostName, this.connectionId, DatabaseService.SERVICE);
  }

}
