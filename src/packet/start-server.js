'use strict';

import Packet from './packet';
import PasswordConverter from '../util/password-converter';

export class StartServerRequest extends Packet {

  /**
   * Create a start server request instance.
   */
  constructor(userId, encryptedPassword, serviceId, socket) {
    if (!userId) {
      throw new Error('Invalid user ID');
    }
    if (!Buffer.isBuffer(encryptedPassword)) {
      throw new Error('Invalid encrypted password');
    }
    if (typeof(serviceId) != 'number') {
      throw new Error('Invalid service ID');
    }
    super(44 + encryptedPassword.length, socket);
    this.length = this.data.length;
    this.serviceId = serviceId;
    this.requestResponseId = StartServerRequest.ID;
    this.templateLength = 2;
    this.clientAttributes = 2; // Get job info back
    this.authType = 1; // Only support password
    this.sendReply = 1;
    this.password = encryptedPassword;
    this.passwordLength = encryptedPassword.length;
    this.userId = userId;
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
   * Get auth type.
   * @return {number} The type.
   */
  get authType() {
    return this.data[20];
  }

  /**
   * Set auth type.
   * @param {number} val - The value.
   */
  set authType(val) {
    this.data[20] = val;
  }

  /**
   * Get send reply.
   * @return {number} The reply.
   */
  get sendReply() {
    return this.data[21];
  }

  /**
   * Set send reply.
   * @param {number} val - The value.
   */
  set sendReply(val) {
    this.data[21] = val;
  }

  /**
   * Get the password.
   * @returns {Buffer} The password.
   */
  get password() {
    return this.getField(StartServerRequest.PASSWORD);
  }

  /**
   * Set the password.
   * @param {Buffer} val - The value.
   */
  set password(val) {
    this.set32Bit(val.length + 6, 22);
    this.set16Bit(StartServerRequest.PASSWORD, 26);
    val.copy(this.data, 28, 0, val.length);
  }

  /**
   * Get the user ID.
   * @returns {Buffer} The user ID.
   */
  get userId() {
    return PasswordConverter.ebcidBufferToString(this.getField(StartServerRequest.USERID));
  }

  /**
   * Set the user ID.
   * @param {String} val - The value.
   */
  set userId(val) {
    let b = PasswordConverter.stringToEBCIDBuffer(val);
    this.set32Bit(16, 28 + this.passwordLength);
    this.set16Bit(StartServerRequest.USERID, 32 + this.passwordLength);
    b.copy(this.data, 34 + this.passwordLength, 0, 10);
  }

  /*************
   * Field IDs *
   *************/

  /**
   * Return the ID for the password field.
   * @return {number} The ID.
   */
  static get PASSWORD() {
    return 0x1105;
  }

  /**
   * Return the ID for the user ID field.
   * @return {number} The ID.
   */
  static get USERID() {
    return 0x1104;
  }

  static get ID() {
    return 0x7002;
  }

}

export class StartServerResponse extends Packet {

   /**
   * Create a new start server response instance.
   */
  constructor(dataOrSize) {
    if (!dataOrSize) {
      super(71);
    } else {
      super(dataOrSize);
    }

    if (!dataOrSize) {
      this.length = this.data.length;
      this.templateLength = 4;
      this.requestResponseId = StartServerResponse.ID;
      this.userId = null;
      this.jobName = null;
      this.rc = 0;
    }
  }

  /**
   * Get the return code.
   * @return {number} The code.
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
   * Get the user ID.
   * @return {string} The user ID.
   */
  get userId() {
    let b = this.getField(StartServerResponse.USERID);
    return PasswordConverter.ebcidBufferToString(b);
  }

  /**
   * Set the user ID.
   * @param {String} val - The value.
   */
  set userId(val) {
    this.set32Bit(16, 24);
    this.set16Bit(StartServerResponse.USERID, 28);
    if (val) {
      let b = PasswordConverter.stringToEBCIDBuffer(val);
      b.copy(this.data, 30, 0, 10);
    }
  }

  /**
   * Get the job name.
   * @return {Buffer} The job name.
   */
  get jobName() {
    return this.getField(StartServerResponse.JOB_NAME);
  }

  /**
   * Set the job name.
   * @param {Buffer} val - The value.
   */
  set jobName(val) {
    this.set32Bit(0x1F, 40);
    this.set16Bit(StartServerResponse.JOB_NAME, 44);
    if (val) {
      val.copy(this.data, 46, 0, 25);
    }
  }

  /**
   * Return the ID for the user ID field.
   * @return {number} The ID.
   */
  static get USERID() {
    return 0x1104;
  }

  /**
   * Return the ID for the job name field.
   * @return {number} The ID.
   */
  static get JOB_NAME() {
    return 0x111F;
  }

  static get ID() {
    return 0xF002;
  }

}
