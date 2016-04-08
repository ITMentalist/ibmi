'use strict';

const debug = require('debug')('ibmi:service:command');
let error = require('debug')('ibmi:service:command:error');
error.color = 1;

export default class Command {

  static get SERVICE() {
    return {
      name: 'as-rmtcmd',
      id: 0xE008,
      defaultPort: 8475,
      defaultTLSPort: 9475
    };
  }

}
