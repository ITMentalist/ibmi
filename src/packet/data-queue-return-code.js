'use strict';

import Packet from './packet';
import DataQueueService from '../service/data-queue-service';

export default class DataQueueReturnCodeResponse extends Packet {

  constructor(dataOrSize) {
    if (!dataOrSize) {
      super(22);
    } else {
      super(dataOrSize);
    }

    if (!dataOrSize) {
      this.length = 22;
      this.serviceId = DataQueueService.SERVICE.id;
      this.requestResponseId = DataQueueReturnCodeResponse.ID;
    }
  }

  /**
   * Get the return code.
   * @return {number} The code.
   */
  get rc() {
    return this.get16Bit(20);
  }

  /**
   * Set the return code.
   * @param {number} val - The value.
   */
  set rc(val) {
    this.set16Bit(val, 20);
  }

  get message() {
    let res = null;
    if (this.length > 22) {
      let length = this.get32Bit(22) - 6;
      res = this.data.slice(28, 28 + length);
    }
    return res;
  }

  set message(val) {
    let length = val.length;
    this.data  = this.data.slice(0, 22);
    let newData = new Buffer(28 + length);
    newData.fill(0);
    this.data.copy(newData, 0, 0, 22);
    val.copy(newData, 28, 0, val.length);
    this.data = newData;
    this.set32Bit(length + 6, 22);
    this.length = this.data.length;
  }

  static get ID() {
    return 0x8002;
  }

}
