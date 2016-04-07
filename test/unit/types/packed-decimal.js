'use strict';

import PackedDecimal from '../../../src/types/packed-decimal';
import DataType from '../../../src/types/data-type';

require('../../common');

describe('PackedDecimal', () => {

  let packedDecimal;

  describe('#constructor()', () => {

    it('should fail to create due to invalid iput', () => {
      expect(() => {return new PackedDecimal(-1, 1);}).to.throw(/Invalid range for number of digits/);
      expect(() => {return new PackedDecimal(64, 1);}).to.throw(/Invalid range for number of digits/);
      expect(() => {return new PackedDecimal(2, -1);}).to.throw(/Invalid range for number of decimal positions/);
      expect(() => {return new PackedDecimal(2, 3);}).to.throw(/Invalid range for number of decimal positions/);
    });

  });

  describe('#toBuffer()', () => {

    it('should fail due to invalid length', () => {
      packedDecimal = new PackedDecimal(4, 2);
      expect(() => {return packedDecimal.toBuffer(111111.11);}).to.throw(/Length is not valid/);
    });

    it('should convert to buffer', () => {
      packedDecimal = new PackedDecimal(7, 2);
      packedDecimal.type.should.equal(DataType.PACKED);
      let b = packedDecimal.toBuffer(12345.69);
      should.exist(b);
      b.toString('hex').should.equal('1234569f');
      packedDecimal = new PackedDecimal(7, 2);
      b = packedDecimal.toBuffer(-12345.69);
      should.exist(b);
      b.toString('hex').should.equal('1234569d');
    });

    it('should convert to buffer and pad', () => {
      packedDecimal = new PackedDecimal(10, 2);
      let b = packedDecimal.toBuffer(12345.69);
      should.exist(b);
      b.toString('hex').should.equal('00001234569f');
      packedDecimal = new PackedDecimal(10, 2);
      b = packedDecimal.toBuffer(1234.69);
      should.exist(b);
      b.toString('hex').should.equal('00000123469f');
    });

    it('should convert to buffer with server value and offset', () => {
      packedDecimal = new PackedDecimal(10, 2);
      let serverValue = new Buffer(12);
      serverValue.fill(0xFF);
      let b = packedDecimal.toBuffer(12345.69, { serverValue: serverValue, offset: 2 });
      should.exist(b);
      b.toString('hex').should.equal('ffff00001234569fffffffff');
    });

  });

});
