'use strict';

import PasswordConverter from '../../../src/util/password-converter';

require('../../common');

describe('PasswordConverter', () => {

  describe('#stringToEBCIDBuffer()', () => {

    it('should convert string to EBCID buffer', () => {
      let expected = new Buffer([0xE3, 0xC5, 0xE2, 0XE3, 0xE4, 0xE2, 0xC5, 0xD9, 0x40, 0x40]);
      let b = PasswordConverter.stringToEBCIDBuffer('TESTUSER');
      ((b.equals(expected))).should.equal(true);
    });

  });

  describe('#stringToBufferByCCSID()', () => {

    it('should convert string to buffer', () => {
      let b = PasswordConverter.stringToBufferByCCSID('data', 37);
      b.toString('hex').should.equal('8481a381');
    });

  });

  describe('#bufferToStringByCCSID()', () => {

    it('should convert buffer to string', () => {
      let b = new Buffer('00000000f8f3f4f6f7f761d8e4e2c5d961d8e9d9c3e2d9e5e2', 'hex');
      let s = PasswordConverter.bufferToStringByCCSID(b, 37);
      s.should.equal('\u0000\u0000834677/QUSER/QZRCSRVS');
    });

  });

  describe('#ebcidBufferToString()', () => {

    it('should convert EBCID buffer to string', () => {
      let b = new Buffer([0xE3, 0xC5, 0xE2, 0XE3, 0xE4, 0xE2, 0xC5, 0xD9, 0x40, 0x40]);
      let s = PasswordConverter.ebcidBufferToString(b);
      s.should.equal('TESTUSER');
    });

  });

  describe('#ebcidBufferToUTF16BEBuffer()', () => {

    it('should convert EBCID buffer to UTF16 BE buffer', () => {
      let expected = new Buffer('0054004500530054005500530045005200200020', 'hex');
      let b = new Buffer([0xE3, 0xC5, 0xE2, 0XE3, 0xE4, 0xE2, 0xC5, 0xD9, 0x40, 0x40]);
      let res = PasswordConverter.ebcidBufferToUTF16BEBuffer(b);
      ((res.equals(expected))).should.equal(true);
    });

    it('should convert EBCID buffer to UTF16 BE buffer triming space', () => {
      let expected = new Buffer('00540045005300540055005300450052', 'hex');
      let b = new Buffer([0xE3, 0xC5, 0xE2, 0XE3, 0xE4, 0xE2, 0xC5, 0xD9, 0x40, 0x40]);
      let res = PasswordConverter.ebcidBufferToUTF16BEBuffer(b, true);
      ((res.equals(expected))).should.equal(true);
    });

  });

  describe('#stringToUTF16BEBuffer()', () => {

    it('should convert string to UTF16 BE buffer', () => {
      let expected = new Buffer('0050004100530053', 'hex');
      let res = PasswordConverter.stringToUTF16BEBuffer('PASS');
      ((res.equals(expected))).should.equal(true);
    });

    it('should convert string to UTF16 BE buffer trimming space', () => {
      let expected = new Buffer('0050004100530053', 'hex');
      let res = PasswordConverter.stringToUTF16BEBuffer('PASS  ', true);
      ((res.equals(expected))).should.equal(true);
    });

  });

  describe('#ebcidStrLen()', () => {

    it('should get EBCID string length', () => {
      let b = new Buffer([0xE3, 0xC5, 0xE2, 0XE3, 0xE4, 0xE2, 0xC5, 0xD9, 0x40, 0x40]);
      let len = PasswordConverter.ebcidStrLen(b);
      len.should.equal(8);
    });

  });

});
