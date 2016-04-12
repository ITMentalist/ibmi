'use strict';

import DES from './des';
import PasswordConverter from './password-converter';
import crypto from 'crypto';

const debug = require('debug')('ibmi:util:password-encryptor');

/**
 * This class encrypts a password based on password level.
 */
export default class PasswordEncryptor {

  /**
   * Create a new encryptor from a password level.
   * @constructor
   * @public
   * @param {number} passwordLevel - The password level.
   */
  constructor(passwordLevel) {
    this.passwordLevel = passwordLevel;
  }

  /**
   * Encrypt a password.
   * @param {string} userId - The user ID.
   * @param {string} password - The password.
   */
  encrypt(userId, password, clientSeed, serverSeed) {
    debug('Attempt to encrypt password for %s at level %d', userId, this.passwordLevel);

    if (this.passwordLevel === 0 || this.passwordLevel == 1) {
      return this.encryptDES(userId, password, clientSeed, serverSeed);
    } else {
      return this.encryptSHA1(userId, password, clientSeed, serverSeed);
    }
  }

  /**
   * Encrypt a password via SHA1.
   */
  encryptSHA1(userId, password, clientSeed, serverSeed) {
    debug('Encrypting password for %s via SHA1', userId);
    let sequence = new Buffer([0, 0, 0, 0, 0, 0, 0, 1]);
    let tokenSum = crypto.createHash('sha1');

    // Generate password token
    let userIdEBCID = PasswordConverter.stringToEBCIDBuffer(userId);
    let userIdBytes = PasswordConverter.ebcidBufferToUTF16BEBuffer(userIdEBCID);

    let passwordBytes = PasswordConverter.stringToUTF16BEBuffer(password, true);

    tokenSum.update(userIdBytes);
    tokenSum.update(passwordBytes);
    let passwordToken = tokenSum.digest();

    let sum = crypto.createHash('sha1');

    // Final substitution
    sum.update(passwordToken);
    sum.update(new Buffer(serverSeed));
    sum.update(new Buffer(clientSeed));
    sum.update(userIdBytes);
    sum.update(sequence);

    let res = sum.digest();

    return res;
  }

  /**
   * Encrypt a password via DES.
   */
  encryptDES(userId, password, clientSeed, serverSeed) {
    debug('Encrypting password for %s via DES', userId);
    let sequence = new Buffer([0, 0, 0, 0, 0, 0, 0, 1]);
    let verifyToken = new Buffer(8);
    verifyToken.fill(0);
    let userIdEBCID = PasswordConverter.stringToEBCIDBuffer(userId.toUpperCase());
    let passwordToken = this.generatePasswordToken(userId, password, sequence);
    let encrypted = this.generatePasswordSubstitute(userIdEBCID, passwordToken, verifyToken, sequence, clientSeed, serverSeed);
    return encrypted;
  }

  /**
   * Generates a DES password token. The password token is used as key to encrypt the password.<br/>
   * Generation of the token is as follows.<br/>
   * <ul>
   * <li>Password is converted to EBCID padded to right with 0x40s.</li>
   * <li>The password is xored 8 bytes of 0x55.</li>
   * </ul>
   */
  generatePasswordToken(userId, password) {
    let userIdEBCID = PasswordConverter.stringToEBCIDBuffer(userId);
    let passwordEBCID = PasswordConverter.stringToEBCIDBuffer(password);

    let token = new Buffer(8);
    token.fill(0);
    let workBuffer1 = new Buffer(10);
    workBuffer1.fill(0);
    let workBuffer2 = new Buffer(10);
    workBuffer2.fill(0x40);
    let workBuffer3 = new Buffer(10);
    workBuffer3.fill(0x40);

    // Copy user id into work buffer
    userIdEBCID.copy(workBuffer1, 0, 0, 10);

    let len = PasswordConverter.ebcidStrLen(userIdEBCID, 10);

    if (len > 8) {
      // Fold user id
      workBuffer1[0] ^= (workBuffer1[8] & 0xC0);
      workBuffer1[1] ^= (workBuffer1[8] & 0x30) << 2;
      workBuffer1[2] ^= (workBuffer1[8] & 0x0C) << 4;
      workBuffer1[3] ^= (workBuffer1[8] & 0x03) << 6;
      workBuffer1[4] ^= (workBuffer1[9] & 0xC0);
      workBuffer1[5] ^= (workBuffer1[9] & 0x30) << 2;
      workBuffer1[6] ^= (workBuffer1[9] & 0x0C) << 4;
      workBuffer1[7] ^= (workBuffer1[9] & 0x03) << 6;
    }

    // Work with password
    len = PasswordConverter.ebcidStrLen(passwordEBCID, 10);

    if (len > 8) {
      // Copy first 8 bytes of password to wb 2
      passwordEBCID.copy(workBuffer2, 0, 0, 8);

      // copy the remaining password to workBuffer3
      passwordEBCID.copy(workBuffer3, 0, 8, len);

      // generate the token for the first 8 bytes of password
      this.xor55AndLshift(workBuffer2);

      workBuffer2 =  // first token
        DES.encrypt(workBuffer2,  // shifted result
                    workBuffer1);

      // generate the token for the second 8 bytes of password
      this.xor55AndLshift(workBuffer3);

      workBuffer3 =  // second token
        DES.encrypt(workBuffer3,  // shifted result
                    workBuffer1);  // userID

      // exclusive-or the first and second token to get the real token
      this.xORBuffer(workBuffer2, workBuffer3, token);
    } else {
      // Copy password to work buffer
      passwordEBCID.copy(workBuffer2, 0, 0, len);

      // Generate token
      this.xor55AndLshift(workBuffer2);

      token = DES.encrypt(workBuffer2, workBuffer1);
    }
    return token;
  }

  /**
   * Generates a password substitue using DES.
   */
  generatePasswordSubstitute(usernameEBCID, token, verifyToken, sequence, clientSeed, serverSeed) {
    let RDrSEQ = new Buffer(8);
    RDrSEQ.fill(0);
    let nextData = new Buffer(8);
    nextData.fill(0);
    let nextEncryptedData = new Buffer(8);
    nextEncryptedData.fill(0);

    //first data or RDrSEQ = password sequence + host seed
    this.addBuffer(sequence, serverSeed, RDrSEQ, 8);

    // first encrypted data = DES(token, first data)
    nextEncryptedData = DES.encrypt(token, RDrSEQ);

    // second data = first encrypted data ^ client seed
    this.xORBuffer(nextEncryptedData, clientSeed, nextData);

    // second encrypted data (password verifier) = DES(token, second data)
    nextEncryptedData = DES.encrypt(token, nextData);

    // let's copy second encrypted password to password verifier.
    // Don't know what it is yet but will ask Leonel.
    nextEncryptedData.copy(verifyToken, 0, 0, 8);

    // third data = RDrSEQ ^ first 8 bytes of userID
    this.xORBuffer(usernameEBCID, RDrSEQ, nextData);

    // third data ^= third data ^ second encrypted data
    this.xORBuffer(nextData, nextEncryptedData, nextData);

    // third encrypted data = DES(token, third data)
    nextEncryptedData = DES.encrypt(token, nextData);

    // leftJustify the second 8 bytes of user ID
    for (let i = 0; i < 8; i++) {
      nextData[i] = 0x40;
    }
    nextData[0] = usernameEBCID[8];
    nextData[1] = usernameEBCID[9];

    // fourth data = second half of userID ^ RDrSEQ;
    this.xORBuffer(RDrSEQ, nextData, nextData);

    // fourth data = third encrypted data ^ fourth data
    this.xORBuffer(nextData, nextEncryptedData, nextData);

    // fourth encrypted data = DES(token, fourth data)
    nextEncryptedData = DES.encrypt(token, nextData);

    // fifth data = fourth encrypted data ^ sequence number
    this.xORBuffer(sequence, nextEncryptedData, nextData);

    // fifth encrypted data = DES(token, fifth data) this is the encrypted password
    return DES.encrypt(token, nextData);
  }

  addBuffer(buff1, buff2, result, len) {
    let carryBit = 0;
    for (let i = len - 1; i >= 0; i--) {
      let temp = (buff1[i] & 0xff) + (buff2[i] & 0xff) + carryBit;
      carryBit = temp >>> 8;
      result[i] = temp;
    }
  }

  xORBuffer(buff1, buff2, buff3) {
    for (let i = 0; i < 8; i++) {
      buff3[i] = (buff1[i] ^ buff2[i]);
    }
  }

  /**
   * XORs the buffer with 8 bytes of 0x55 and shifts everything to the left.
   */
  xor55AndLshift(buff) {
    buff[0] ^= 0x55;
    buff[1] ^= 0x55;
    buff[2] ^= 0x55;
    buff[3] ^= 0x55;
    buff[4] ^= 0x55;
    buff[5] ^= 0x55;
    buff[6] ^= 0x55;
    buff[7] ^= 0x55;

    buff[0] = (buff[0] << 1 | (buff[1] & 0x80) >>> 7);
    buff[1] = (buff[1] << 1 | (buff[2] & 0x80) >>> 7);
    buff[2] = (buff[2] << 1 | (buff[3] & 0x80) >>> 7);
    buff[3] = (buff[3] << 1 | (buff[4] & 0x80) >>> 7);
    buff[4] = (buff[4] << 1 | (buff[5] & 0x80) >>> 7);
    buff[5] = (buff[5] << 1 | (buff[6] & 0x80) >>> 7);
    buff[6] = (buff[6] << 1 | (buff[7] & 0x80) >>> 7);
    buff[7] <<= 1;
  }

}
