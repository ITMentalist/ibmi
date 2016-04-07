'use strict';

import DataType from './data-type';

const debug = require('debug')('ibmi:types:structure');
let error = require('debug')('ibmi:types:array:structure');
error.color = 1;

export default class Structure {

  constructor(members) {
    this.members = members;
    this.type = DataType.STRUCTURE;
    debug('Structure created with members: %j', this.members);
  }

  toBuffer(values, opts) {
    debug('Attempt to convert %j to buffer', values);

    opts = opts || { };
    let serverValue;
    let offset = 0;

    if (!opts.serverValue) {
      serverValue = new Buffer(this.length);
      serverValue.fill(0);
    } else {
      serverValue = opts.serverValue;
    }

    if (opts.offset) {
      offset = opts.offset;
    }

    for (let i = 0; i < this.members.length; i++) {
      let b = this.members[i].toBuffer(values[i]);
      b.copy(serverValue, offset, 0, this.members[i].length);
      offset += this.members[i].length;
    }

    return serverValue;
  }

  get length() {
    let res = 0;
    for (let member of this.members) {
      res += member.length;
    }
    return res;
  }

}
