'use strict';

import Packet from './packet';
import DataQueueService from '../service/data-queue-service';

export class DataQueueReadRequest extends Packet {

  constructor(name, library, search, wait, peek, key) {
    super((!key) ? 48 : 54 + key.length);

    this.length = this.data.length;
    this.templateLength = 28;
    this.serviceId = DataQueueService.SERVICE.id;
    this.requestResponseId = DataQueueReadRequest.ID;

    this.name = name;
    this.library = library;

    this.data[40] = (!key) ? 0xF0 : 0xF1;
    if (search) {
      this.search = search;
    }
    this.wait = wait;

    if (peek) {
      this.peek = 0xF1;
    } else {
      this.peek = 0xF0;
    }

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

  set search(val) {
    val.copy(this.data, 41, 0, 2);
  }

  get search() {
    return this.data.slice(41, 43);
  }

  set wait(val) {
    this.set32Bit(val, 43);
  }

  get wait() {
    return this.get32Bit(43);
  }

  set peek(val) {
    this.data[47] = val;
  }

  get peek() {
    return this.data[47];
  }

  get key() {
    return this.getField(DataQueueReadRequest.KEY);
  }

  set key(val) {
    this.set32Bit(val.length + 6, 48);
    this.set16Bit(DataQueueReadRequest.KEY, 52);
    val.copy(this.data, 54, 0, val.length);
  }

  static get KEY() {
    return 0x5002;
  }

  static get ID() {
    return 0x0002;
  }

}
