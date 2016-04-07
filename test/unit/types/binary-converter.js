'use strict';

import BinaryConverter from '../../../src/types/binary-converter';

require('../../common');

describe('BinaryConverter', () => {

  describe('#shortToBuffer()', () => {

    it('should convert short to buffer', () => {
      let b = BinaryConverter.shortToBuffer(3276);
      should.exist(b);
      b.toString('hex').should.equal('0ccc');
    });

  });

  describe('#unsignedShortTuBuffer()', () => {

    it('should convert unsigned short to buffer', () => {
      let b = BinaryConverter.unsignedShortToBuffer(3276);
      should.exist(b);
      b.toString('hex').should.equal('0ccc');
    });

  });

  describe('#intToBuffer()', () => {

    it('should convert int to buffer', () => {
      let b = BinaryConverter.intToBuffer(2147483647);
      should.exist(b);
      b.toString('hex').should.equal('7fffffff');
    });

  });

  describe('#unsignedIntToBuffer()', () => {

    it('should convert unsigned int to buffer', () => {
      let b = BinaryConverter.unsignedIntToBuffer(2147483647);
      should.exist(b);
      b.toString('hex').should.equal('7fffffff');
    });

  });

  describe('#longToBuffer()', () => {

    it('should convert long to buffer', () => {
      let b = BinaryConverter.longToBuffer('0xfedcba9876543210');
      should.exist(b);
      b.toString('hex').should.equal('fedcba9876543210');
    });

  });

  describe('#floatToBuffer()', () => {

    it('should convert float to buffer', () => {
      let b = BinaryConverter.floatToBuffer(0xcafebabe);
      should.exist(b);
      b.toString('hex').should.equal('4f4afebb');
    });

  });

  describe('#doubleToBuffer()', () => {

    it('should convert double to buffer', () => {
      let b = BinaryConverter.doubleToBuffer(0xdeadbeefcafebabe);
      should.exist(b);
      b.toString('hex').should.equal('43ebd5b7ddf95fd7');
    });

  });

});
