'use strict';

import Packet from './packet';
import Signon from '../service/signon';
import PasswordConverter from '../util/password-converter';

export class ChangePasswordRequest extends Packet {

  constructor(userId, oldPassword, newPassword, encryptedPassword, serverLevel) {
    if (typeof(userId) != 'string') {
      throw new Error('Invalid user ID');
    }
    if (typeof(oldPassword) != 'string') {
      throw new Error('Invalid old password');
    }
    if (typeof(newPassword) != 'string') {
      throw new Error('Invalid new password');
    }
    if (!Buffer.isBuffer(encryptedPassword)) {
      throw new Error('Invalid encrypted password');
    }
    if (typeof(serverLevel) != 'number') {
      throw new Error('Invalid server level');
    }

    super(63 + oldPassword.length + newPassword.length + (encryptedPassword.length == 8 ? 0 : 42) + (serverLevel < 5 ? 0 : 7));

    this.encryptedPasswordLength = encryptedPassword.length;
    this.oldPasswordLength = oldPassword.length;
    this.newPasswordLength = newPassword.length;
    this.length = this.data.length;
    this.serviceId = Signon.SERVICE.id;
    this.requestResponseId = ChangePasswordRequest.ID;
    this.templateLength = 1;

    // Password's always encrypted.
    this.data[20] = (encryptedPassword.length == 8) ? 0x01 : 0x03;

    this.userId = userId;
    this.password = encryptedPassword;
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;

    if (encryptedPassword.length != 8) {  // If we're using SHA-1 passwords.
    }

    if (serverLevel >= 5) {
      this.returnError = 0x01;
    }
  }

  /**
   * Get the user ID.
   * @returns {Buffer} The user ID.
   */
  get userId() {
    return PasswordConverter.ebcidBufferToString(this.getField(ChangePasswordRequest.USERID));
  }

  /**
   * Set the user ID.
   * @param {String} val - The value.
   */
  set userId(val) {
    let b = PasswordConverter.stringToEBCIDBuffer(val);
    this.set32Bit(16, 21);
    this.set16Bit(ChangePasswordRequest.USERID, 25);
    b.copy(this.data, 27, 0, 10);
  }

  get password() {
    return this.getField(ChangePasswordRequest.PASSWORD);
  }

  set password(val) {
    this.set32Bit(6 + val.length, 37);
    this.set16Bit(ChangePasswordRequest.PASSWORD, 41);
    val.copy(this.data, 43, 0, val.length);
  }

  get oldPassword() {
    return this.getField(ChangePasswordRequest.OLD_PASSWORD);
  }

  set oldPassword(val) {
    this.set32Bit(6 + val.length, 43 + this.encryptedPasswordLength);
    this.set16Bit(ChangePasswordRequest.OLD_PASSWORD, 47 + this.encryptedPasswordLength);
    let b = new Buffer(val);
    b.copy(this.data, 49 + this.encryptedPasswordLength, 0, b.length);
  }

  get newPassword() {
    return this.getField(ChangePasswordRequest.NEW_PASSWORD);
  }

  set newPassword(val) {
    this.set32Bit(6 + val.length, 49 + this.encryptedPasswordLength + this.oldPasswordLength);
    this.set16Bit(ChangePasswordRequest.NEW_PASSWORD, 53 + this.encryptedPasswordLength + this.oldPasswordLength);
    let b = new Buffer(val);
    b.copy(this.data, 55 + this.encryptedPasswordLength + this.oldPasswordLength, 0, b.length);
  }

  get returnError() {
    return this.getField(ChangePasswordRequest.RETURN_ERROR);
  }

  set returnError(val) {
    let offset = 63 + this.oldPasswordLength + this.newPasswordLength + (this.encryptedPasswordLength == 8 ? 0 : 42);
    console.log(offset);
    this.set32Bit(7, offset);
    this.set16Bit(ChangePasswordRequest.RETURN_ERROR, offset + 4);
    this.data[offset + 6] = val;
  }

  static get USERID() {
    return 0x1104;
  }

  static get PASSWORD() {
    return 0x1105;
  }

  static get OLD_PASSWORD() {
    return 0x110C;
  }

  static get NEW_PASSWORD() {
    return 0x110D;
  }

  static get RETURN_ERROR() {
    return 0x1128;
  }

  static get ID() {
    return 0x7005;
  }

}
