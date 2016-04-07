'use strict';

import IArray from '../../../src/types/array';
import Text from '../../../src/types/text';
import PackedDecimal from '../../../src/types/packed-decimal';
import DataType from '../../../src/types/data-type';

require('../../common');

describe('IArray', () => {

  let array;

  describe('#constructor()', () => {

    it('should fail to create due to invalid size', () => {
      expect(() => {return new IArray(DataType.TEXT, -1);}).to.throw(/Size must be greater than or equal to 0/);
    });

    it('should create new instance', () => {
      array = new IArray(new Text(4), 5);
      should.exist(array);
      array.size.should.equal(5);
      array.type.should.equal(DataType.ARRAY);
      array.arrayType.type.should.equal(DataType.TEXT);
    });

  });

  describe('#toBuffer()', () => {

    it('should fail due to invalid length of input', () => {
      array = new IArray(new Text(4), 5);
      expect(() => { array.toBuffer([]);}).to.throw(/Length is not valid/);
    });

    it('should convert text arry to buffer', () => {
      let text = new Text(4);
      array = new IArray(text, 2);
      let values = [ 'data', 'next' ];
      let b = array.toBuffer(values);
      should.exist(b);
      b.toString('hex').should.equal('8481a3819585a7a3');
    });

    it('should convert packed decimal array to buffer', () => {
      let packedDecimal = new PackedDecimal(7, 2);
      array = new IArray(packedDecimal, 2);
      let values = [ 12345.69, 54321.96 ];
      let b = array.toBuffer(values);
      should.exist(b);
      b.toString('hex').should.equal('1234569f5432196f');
    });

    it('should convert text array to buffer with server value and offset', () => {
      let text = new Text(4);
      array = new IArray(text, 2);
      let values = [ 'data', 'next' ];
      let serverValue = new Buffer(12);
      serverValue.fill(0xFF);
      let b = array.toBuffer(values, { serverValue: serverValue, offset: 2 });
      should.exist(b);
      b.toString('hex').should.equal('ffff8481a3819585a7a3ffff');
    });

  });

});
