'use strict';

import ByteArray from '../../../src/types/byte-array';
import DataType from '../../../src/types/data-type';

require('../../common');

describe('ByteArray', () => {

  let byteArray;

  describe('#constructor()', () => {

    it('should create new instance', () => {
      byteArray = new ByteArray(10);
      byteArray.type.should.equal(DataType.BYTE_ARRAY);
      byteArray.length.should.equal(10);
    });

  });

  describe('#toBuffer()', () => {

    it('should convert to buffer', () => {
      let data = new Buffer('data');
      byteArray = new ByteArray(4);
      let b = byteArray.toBuffer(data);
      should.exist(b);
      b.toString('hex').should.equal('64617461');
    });

    it('should convert to buffer with server value and offset', () => {
      let data = new Buffer('data');
      let serverValue = new Buffer(6);
      serverValue.fill(0xFF);
      let b = byteArray.toBuffer(data, { serverValue: serverValue, offset: 2 });
      should.exist(b);
      b.toString('hex').should.equal('ffff64617461');
    });

  });

});
