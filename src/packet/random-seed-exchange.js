'use strict';

import Packet from './packet';
import crypto from 'crypto';

export class RandomSeedExchangeRequest extends Packet {

  /**
   * Create a new random seed exchange request instance.
   * @public
   * @constructor
   */
  constructor(serviceId, socket) {
    if (typeof(serviceId) != 'number') {
      throw new Error('Invalid service ID');
    }
    super(28, socket);
    this.length = 28;
    this.serviceId = serviceId;
    this.clientAttributes = 1; // Can use SHA1
    this.templateLength = 8;
    this.requestResponseId = RandomSeedExchangeRequest.ID;
    this.seed = crypto.randomBytes(8);
  }

  /**
   * Get client attributes.
   * @return {number} The attributes.
   */
  get clientAttributes() {
    return this.data[4];
  }

  /**
   * Set client attributes.
   * @param {number} val - The value.
   */
  set clientAttributes(val) {
    this.data[4] = val;
  }

  /**
   * Get the seed.
   * @return {Buffer} The seed.
   */
  get seed() {
    return this.data.slice(20);
  }

  /**
   * Set the seeed.
   * @param {Buffer} val - The value.
   */
  set seed(val) {
    val.copy(this.data, 20, 0, 8);
  }

  static get ID() {
    return 0x7001;
  }

}
