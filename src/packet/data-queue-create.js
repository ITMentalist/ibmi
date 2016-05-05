'use strict';

import Packet from './packet';
import DataQueueService from '../service/data-queue-service';

export class DataQueueCreateRequest extends Packet {

  constructor(name, library, entryLength, authority, saveSenderInfo, fifo, keyLength, forceStorage, description) {
    super(100);

    this.length = this.data.length;
    this.serviceId = DataQueueService.SERVICE.id;
    this.requestResponseId = DataQueueCreateRequest.ID;
    this.templateLength = 80;

    this.entryLength = entryLength;
    this.name = name;
    this.library = library;

    if (authority == '*LIBCRTAUT') {
      this.authority = 0xF4;
    } else if (authority == '*ALL') {
      this.authority = 0xF0;
    } else if (authority == '*CHANGE') {
      this.authority = 0xF1;
    } else if (authority == '*EXCLUDE') {
      console.log('*** HERE');
      this.authority = 0xF2;
    } else {
      this.authority = 0xF3;
    }

    if (saveSenderInfo) {
      this.saveSenderInfo = 0xF1;
    } else {
      this.saveSenderInfo = 0xF0;
    }

    if (keyLength === 0) {
      if (fifo) {
        this.type = 0xF0;
      } else {
        this.type = 0xF1;
      }
    } else {
      this.type = 0xF2;
    }

    this.keyLength = keyLength;

    if (forceStorage) {
      this.forceStorage = 0xF1;
    } else {
      this.forceStorage = 0xF0;
    }

    this.description = description;
  }

  get entryLength() {
    return this.get32Bit(40);
  }

  set entryLength(val) {
    this.set32Bit(val, 40);
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

  get authority() {
    return this.data[44];
  }

  set authority(val) {
    this.data[44] = val;
  }

  get saveSenderInfo() {
    return this.data[45];
  }

  set saveSenderInfo(val) {
    this.data[45] = val;
  }

  get type() {
    return this.data[46];
  }

  set type(val) {
    this.data[46] = val;
  }

  get keyLength() {
    return this.get16Bit(47);
  }

  set keyLength(val) {
    this.set16Bit(val, 47);
  }

  get forceStorage() {
    return this.data[49];
  }

  set forceStorage(val) {
    this.data[49] = val;
  }

  get description() {
    return this.data.slice(50, 100);
  }

  set description(val) {
    val.copy(this.data, 50, 0, 50);
  }

  static get ID() {
    return 0x0003;
  }

}
