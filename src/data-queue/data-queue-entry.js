'use strict';

export default class DataQueueEntry {

  constructor(data, senderInfo, converter) {
    this.data = data;
    this.senderInfo = senderInfo || '';
    this.converter = converter;
  }

  toString() {
    return this.converter.bufferToString(this.data);
  }

}
