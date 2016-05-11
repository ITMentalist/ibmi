'use strict';

import Packet from './packet';
import RemoteCommandService from '../service/remote-command-service';
import Environment from '../util/environment';

export class RemoteCommandExchangeAttributesRequest extends Packet {

  constructor(nlv) {
    if (typeof(nlv) != 'string') {
      throw new Error('Invalid NLV');
    }

    super(34);
    this.length = this.data.length;
    this.templateLength = 14;
    this.serviceId = RemoteCommandService.SERVICE.id;
    this.requestResponseId = RemoteCommandExchangeAttributesRequest.ID;

    this.ccsid = Environment.getCcsid();
    this.nlv = nlv;
    this.clientVersion = 1;
  }

  /**
   * Get CCSID.
   */
  get ccsid() {
    return this.get32Bit(20);
  }

  /**
   * Set CCSID.
   */
  set ccsid(val) {
    this.set32Bit(val, 20);
  }

  /**
   * Get NLV
   */
  get nlv() {
    return this.get32Bit(24);
  }

  /**
   * Set NLV.
   */
  set nlv(val) {
    this.data[24] = val[0] | 0x00F0;
    this.data[25] = val[1] | 0x00F0;
    this.data[26] = val[2] | 0x00F0;
    this.data[27] = val[3] | 0x00F0;
  }

  /**
   * Get client version.
   */
  get clientVersion() {
    return this.get32Bit(28);
  }

  /**
   * Set client version.
   */
  set clientVersion(val) {
    this.set32Bit(val, 28);
  }

  static get ID() {
    return 0x1001;
  }

}

export class RemoteCommandExchangeAttributesResponse extends Packet {

  constructor(dataOrSize) {
    if (!dataOrSize) {
      super(36);
    } else {
      super(dataOrSize);
    }

    if (!dataOrSize) {
      this.length = 36;
      this.serviceId = RemoteCommandService.SERVICE.id;
      this.requestResponseId = RemoteCommandExchangeAttributesResponse.ID;
      this.rc = 0;
      this.ccsid = 0;
      this.dsLevel = 0;
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

  /**
   * Get CCSID.
   */
  get ccsid() {
    return this.get32Bit(22);
  }

  /**
   * Set CCSID.
   */
  set ccsid(val) {
    this.set32Bit(val, 22);
  }

  /**
   * Get data stream level.
   */
  get dsLevel() {
    return this.get16Bit(34);
  }

  /**
   * Set data stream level.
   */
  set dsLevel(val) {
    this.set16Bit(val, 34);
  }

  static get ID() {
    return 0x8001;
  }

}
