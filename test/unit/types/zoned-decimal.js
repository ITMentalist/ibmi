'use strict';

import ZonedDecimal from '../../../src/types/zoned-decimal';
import DataType from '../../../src/types/data-type';

require('../../common');

describe('ZonedDecimal', () => {

  let zonedDecimal;

  describe('#constructor()', () => {

    it('should fail to create due to invalid iput', () => {
      expect(() => {return new ZonedDecimal(-1, 1);}).to.throw(/Invalid range for number of digits/);
      expect(() => {return new ZonedDecimal(64, 1);}).to.throw(/Invalid range for number of digits/);
      expect(() => {return new ZonedDecimal(2, -1);}).to.throw(/Invalid range for number of decimal positions/);
      expect(() => {return new ZonedDecimal(2, 3);}).to.throw(/Invalid range for number of decimal positions/);
    });

  });

  describe('#toBuffer()', () => {

    it('should fail due to invalid length', () => {
      zonedDecimal = new ZonedDecimal(4, 2);
      expect(() => {return zonedDecimal.toBuffer(111111.11);}).to.throw(/Length is not valid/);
      expect(() => {return zonedDecimal.toBuffer(1.111);}).to.throw(/Length is not valid/);
    });

    it('should convert to buffer', () => {
      zonedDecimal = new ZonedDecimal(7, 2);
      zonedDecimal.length.should.equal(7);
      zonedDecimal.type.should.equal(DataType.ZONED);
      let b = zonedDecimal.toBuffer(12345.69);
      should.exist(b);
      b.toString('hex').should.equal('f1f2f3f4f5f6f9');
      zonedDecimal = new ZonedDecimal(7, 2);
      b = zonedDecimal.toBuffer(-12345.69);
      should.exist(b);
      b.toString('hex').should.equal('f1f2f3f4f5f6d9');
    });

    it('should convert to buffer and pad', () => {
      zonedDecimal = new ZonedDecimal(10, 2);
      let b = zonedDecimal.toBuffer(12345.69);
      should.exist(b);
      b.toString('hex').should.equal('f0f0f0f1f2f3f4f5f6f9');
    });

    it('should convert to buffer with server value and offset', () => {
      zonedDecimal = new ZonedDecimal(10, 2);
      let serverValue = new Buffer(14);
      serverValue.fill(0xFF);
      let b = zonedDecimal.toBuffer(12345.69, { serverValue: serverValue, offset: 2 });
      should.exist(b);
      b.toString('hex').should.equal('fffff0f0f0f1f2f3f4f5f6f9ffff');
    });

  });

});
