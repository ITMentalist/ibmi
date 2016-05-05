'use strict';

import Packet from './packet';
import DataQueueService from '../service/data-queue-service';

export class DataQueueDeleteRequest extends Packet {

  constructor(name, library) {
    super(40);

    this.length = this.data.length;
    this.templateLength = 20;
    this.serviceId = DataQueueService.SERVICE.id;
    this.requestResponseId = DataQueueDeleteRequest.ID;

    this.name = name;
    this.library = library;
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

  static get ID() {
    return 0x0004;
  }

}
