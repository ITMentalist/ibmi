'use strict';

import Packet from './packet';
import DataQueueService from '../service/data-queue-service';

export class DataQueueClearRequest extends Packet {

  constructor(name, library, key) {
    super((!key) ? 41 : 47 + key.length);

    this.length = this.data.length;
    this.templateLength = 21;
    this.serviceId = DataQueueService.SERVICE.id;
    this.requestResponseId = DataQueueClearRequest.ID;

    this.data[40] = (!key) ? 0xF0 : 0xF1;

    this.name = name;
    this.library = library;

    if (key) {
      this.key = key;
    }
  }

  get name() {
    return this.data.slice(20, 30);
  }

  set name(val) {
    val.copy(this.data, 20, 0, 10);
  }

  get library() {
    return this.data.slice(30, 40);
  }

  set library(val) {
    val.copy(this.data, 30, 0, 10);
  }

  get key() {
    return this.getField(DataQueueClearRequest.KEY);
  }

  set key(val) {
    this.set32Bit(val.length + 6, 41);
    this.set16Bit(DataQueueClearRequest.KEY, 45);
    val.copy(this.data, 47, 0, val.length);
  }

  static get KEY() {
    return 0x5002;
  }

  static get ID() {
    return 0x0006;
  }

}
