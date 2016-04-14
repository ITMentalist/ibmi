'use strict';

import Packet from './packet';
import Signon from '../service/signon';
import PasswordConverter from '../util/password-converter';

/**
 * Signon info request packet.
 */
export class SignonInfoRequest extends Packet {

  /**
   * Create a new signon info request instance.
   * @constructor
   * @public
   */
  constructor(userId, encryptedPassword, serverLevel) {
    if (typeof(userId) != 'string') {
      throw new Error('Invalid user ID');
    }
    if (!Buffer.isBuffer(encryptedPassword)) {
      throw new Error('Invalid encrypted password');
    }
    if (typeof(serverLevel) != 'number') {
      throw new Error('Invalid server level');
    }

    super(37 + encryptedPassword.length + 16 + (serverLevel < 5 ? 0 : 7));

    this.passwordLength = encryptedPassword.length;

    this.length = this.data.length;
    this.serviceId = Signon.SERVICE.id;
    this.templateLength = 1;
    this.requestResponseId = SignonInfoRequest.ID;

    this.authenticationScheme = 1; // Only support encrypted
    this.clientCCSID = 1200;
    this.password = encryptedPassword;
    this.userId = userId;
    if (serverLevel >= 5) {
      this.returnErrorMessages = 1;
    }
  }

  static get ID() {
    return 0x7004;
  }

  /**
   * Get the authentication scheme.
   * @return {number} The scheme.
   */
  get authenticationScheme() {
    return this.data[20];
  }

  /**
   * Set the authentication scheme.
   * @param {number} val - The value.
   */
  set authenticationScheme(val) {
    this.data[20] = val;
  }

  /**
   * Get the client CCSID.
   * @returns {number} The CCSID.
   */
  get clientCCSID() {
    return this.getField(SignonInfoRequest.CLIENT_CCSID).readUInt32BE(0);
  }

  /**
   * Set the client CCSID.
   * @param {number} val - The value
   */
  set clientCCSID(val) {
    this.set32Bit(10, 21);
    this.set16Bit(SignonInfoRequest.CLIENT_CCSID, 25);
    this.set32Bit(val, 27);
  }

  /**
   * Get the password.
   * @returns {Buffer} The password.
   */
  get password() {
    return this.getField(SignonInfoRequest.PASSWORD);
  }

  /**
   * Set the password.
   * @param {Buffer} val - The value.
   */
  set password(val) {
    this.set32Bit(val.length + 6, 31);
    this.set16Bit(SignonInfoRequest.PASSWORD, 35);
    val.copy(this.data, 37, 0, val.length);
  }

  /**
   * Get the user ID.
   * @returns {Buffer} The user ID.
   */
  get userId() {
    return PasswordConverter.ebcidBufferToString(this.getField(SignonInfoRequest.USERID));
  }

  /**
   * Set the user ID.
   * @param {String} val - The value.
   */
  set userId(val) {
    let b = PasswordConverter.stringToEBCIDBuffer(val);
    this.set32Bit(16, 37 + this.passwordLength);
    this.set16Bit(SignonInfoRequest.USERID, 41 + this.passwordLength);
    b.copy(this.data, 43 + this.passwordLength, 0, 10);
  }

  /**
   * Get return error messages.
   * @returns {number} Returns error messages.
   */
  get returnErrorMessages() {
    let field = this.getField(SignonInfoRequest.RETURN_ERROR_MESSAGES);
    if (field) {
      return this.getField(SignonInfoRequest.RETURN_ERROR_MESSAGES)[0];
    } else {
      return 0;
    }
  }

  /**
   * Set return error messages.
   * @param {number} val - The value.
   */
  set returnErrorMessages(val) {
    let offset = 37 + this.passwordLength + 16;
    this.set32Bit(7, offset);
    this.set16Bit(SignonInfoRequest.RETURN_ERROR_MESSAGES, offset + 4);
    this.data[offset + 6] = val;
  }

  /*************
   * Field IDs *
   *************/

  /**
   * Return the ID for the client ID field.
   * @return {number} The ID.
   */
  static get CLIENT_CCSID() {
    return 0x1113;
  }

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

  /**
   * Return the ID for the return error messages field.
   * @return {number} The ID.
   */
  static get RETURN_ERROR_MESSAGES() {
    return 0x1128;
  }

}

/**
  * The SignonInfoResponse class implements a signon info response.
  * @class
  * @augments Packet
  */
export class SignonInfoResponse extends Packet {

  /**
   * Create a new signon info request instance.
   * @constructor
   * @public
   */
  constructor(dataOrSize) {
    if (!dataOrSize) {
      super(147);
    } else {
      super(dataOrSize);
    }

    if (!dataOrSize) {
      // Initialize fields
      this.length = 147;
      this.templateLength = 4;
      this.requestResponseId = SignonInfoResponse.ID;
      this.serviceId = Signon.SERVICE.id;
      this.rc = 0;
      this.currentSignonDate = null;
      this.lastSignonDate = null;
      this.passwordExpirationDate = null;
      this.setField(null, 0x1109, 52, 8); // ??
      this.setField(null, 0x110A, 60, 8); // ??
      this.setField(null, 0x110E, 68, 7); // ??
      this.expirationWarning = 0;
      this.setField(null, 0x110B, 85, 14); // ??
      this.serverCCSID = 0;
      this.setField(null, 0x112A, 109, 8); // ??
      this.userId = null;
    }
  }

  static get ID() {
    return 0xF004;
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
   * Get the current signon date.
   * @return {Date} The date.
   */
  get currentSignonDate() {
    return this.getDate(SignonInfoResponse.CURRENT_SIGNON_DATE);
  }

  /**
   * Set the current signon date.
   * @param {Date} val - The value.
   */
  set currentSignonDate(val) {
    this.setDate(val, SignonInfoResponse.CURRENT_SIGNON_DATE, 24);
  }

  /**
   * Get the last signon date.
   * @return {Date} The date.
   */
  get lastSignonDate() {
    return this.getDate(SignonInfoResponse.LAST_SIGNON_DATE);
  }

  /**
   * Set the last signon date.
   * @param {Date} val - The value.
   */
  set lastSignonDate(val) {
    this.setDate(val, SignonInfoResponse.LAST_SIGNON_DATE, 38);
  }

  /**
   * Get the password expiration date.
   * @return {Date} The date.
   */
  get passwordExpirationDate() {
    return this.getDate(SignonInfoResponse.PASSWORD_EXPIRATION_DATE);
  }

  /**
   * Set the password expiration date.
   * @param {Date} val - The value.
   */
  set passwordExpirationDate(val) {
    this.setDate(val, SignonInfoResponse.PASSWORD_EXPIRATION_DATE, 117);
  }

  /**
   * Get the expiration warning.
   * @return {number} The warning.
   */
  get expirationWarning() {
    return this.getField(SignonInfoResponse.EXPIRATION_WARNING).readUInt32BE(0);
  }

  /**
   * Set the expiration warning.
   * @pram {number} val - The value.
   */
  set expirationWarning(val) {
    this.set32Bit(10, 75);
    this.set16Bit(SignonInfoResponse.EXPIRATION_WARNING, 79);
    this.set32Bit(val, 81);
  }

  /**
   * Get the server CCSID.
   * @return {number} The CCSID.
   */
  get serverCCSID() {
    return this.getField(SignonInfoResponse.SERVER_CCSID).readUInt32BE(0);
  }

  /**
   * Get the server CCSID.
   * @param {number} val - The value.
   */
  set serverCCSID(val) {
    this.set32Bit(10, 99);
    this.set16Bit(SignonInfoResponse.SERVER_CCSID, 103);
    this.set32Bit(val, 105);
  }

  /**
   * Get the user ID.
   * @return {string} The user ID.
   */
  get userId() {
    let b = this.getField(SignonInfoResponse.USERID);
    if (b) {
      return PasswordConverter.ebcidBufferToString(b);
    } else {
      return null;
    }
  }

  /**
   * Set the user ID.
   * @param {String} val - The value.
   */
  set userId(val) {
    this.set32Bit(16, 131);
    this.set16Bit(SignonInfoResponse.USERID, 135);
    if (val) {
      let b = PasswordConverter.stringToEBCIDBuffer(val);
      b.copy(this.data, 137, 0, 10);
    }
  }

  /*************
   * Field IDs *
   *************/

  /**
   * Return the ID for the current signon date field.
   * @return {number} The ID.
   */
  static get CURRENT_SIGNON_DATE() {
    return 0x1106;
  }

  /**
   * Return the ID for the last signon date field.
   * @return {number} The ID.
   */
  static get LAST_SIGNON_DATE() {
    return 0x1107;
  }

  /**
   * Return the ID for the password expiration date field.
   * @return {number} The ID.
   */
  static get PASSWORD_EXPIRATION_DATE() {
    return 0x1108;
  }

  /**
   * Return the ID for the expiration warning field.
   * @return {number} The ID.
   */
  static get EXPIRATION_WARNING() {
    return 0x112C;
  }

  /**
   * Return the ID for the server CCSID field.
   * @return {number} The ID.
   */
  static get SERVER_CCSID() {
    return 0x1114;
  }

  /**
   * Return the ID for the user ID field.
   * @return {number} The ID.
   */
  static get USERID() {
    return 0x1104;
  }

}
