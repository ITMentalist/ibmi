'use strict';

import Packet from './packet';
import crypto from 'crypto';

export class RandomSeedExchangeRequest extends Packet {

  /**
   * Create a new random seed exchange request instance.
   * @public
   * @constructor
   */
  constructor(serviceId) {
    if (typeof(serviceId) != 'number') {
      throw new Error('Invalid service ID');
    }
    super(28);
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

/**
 * The RandomSeedExchangeResponse implements a random seed exchange response.
 * @augments Packet
 */
export class RandomSeedExchangeResponse extends Packet {

  /**
   * Create a new random seed exchange response instance.
   * @public
   * @constructor
   */
  constructor(dataOrSize) {
    if (!dataOrSize) {
      super(32);
    } else {
      super(dataOrSize);
    }

    if (!dataOrSize) {
      // Initialize fields
      this.length = 32;
      this.templateLength = 8;
      this.requestResponseId = RandomSeedExchangeResponse.ID;
    }
  }

  /**
   * Get return code.
   * @return {number} The return code.
   */
  get rc() {
    return this.get32Bit(20);
  }

  /**
   * Set the return code.
   * @param {number} val - The value.
   */
  set rc(val) {
    this.set32Bit(val, 20);
  }

  /**
   * Get the seed.
   * @return {Buffer} The seed.
   */
  get seed() {
    return this.data.slice(24);
  }

  /**
   * Set the seeed.
   * @param {Buffer} val - The value.
   */
  set seed(val) {
    val.copy(this.data, 24, 0, 8);
  }

  static get ID() {
    return 0xF001;
  }

}
