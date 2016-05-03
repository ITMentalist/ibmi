'use strict';

import Packet from './packet';
import DataQueueService from '../service/data-queue-service';

export class DataQueueWriteRequest extends Packet {

  constructor(name, library, key, entry) {
    super((!key) ? 48 + entry.length: 54 + entry.length + key.length);

    this.length = this.data.length;
    this.templateLength = 22;
    this.serviceId = DataQueueService.SERVICE.id;
    this.requestResponseId = DataQueueWriteRequest.ID;

    this.data[40] = (!key) ? 0xF0 : 0xF1;
    this.data[41] = 0xF1; // Want reply

    this.name = name;
    this.library = library;

    this.entryLength = entry.length;
    this.entry = entry;

    if (key) {
      this.key = key;
    }
  }

  get name() {
    return this.data.slice(20, 29);
  }

  set name(val) {
    val.copy(this.data, 20, 0, 10);
  }

  get library() {
    return this.data.slice(30, 39);
  }

  set library(val) {
    val.copy(this.data, 30, 0, 10);
  }

  get entry() {
    return this.getField(DataQueueWriteRequest.ENTRY);
  }

  set entry(val) {
    this.set32Bit(val.length + 6, 42);
    this.set16Bit(DataQueueWriteRequest.ENTRY, 46);
    val.copy(this.data, 48, 0, val.length);
  }

  get key() {
    return this.getField(DataQueueWriteRequest.KEY);
  }

  set key(val) {
    this.set32Bit(val.length + 6, 48 + this.entryLength);
    this.set16Bit(DataQueueWriteRequest.KEY, 52 + this.entryLength);
    val.copy(this.data, 54 + this.entryLength, 0, val.length);
  }

  static get KEY() {
    return 0x5002;
  }

  static get ENTRY() {
    return 0x5001;
  }

  static get ID() {
    return 0x0005;
  }

}
