'use strict';

import Text from '../../../src/types/text';
import DataType from '../../../src/types/data-type';

require('../../common');

describe('Text', () => {

  let text;

  describe('#constructor()', () => {

    it('should fail to create due to invalid length', () => {
      expect(() => {return new Text();}).to.throw(/Length must be a number/);
      expect(() => {return new Text('1');}).to.throw(/Length must be a number/);
      expect(() => {return new Text(-1);}).to.throw(/Length must be greater than or equal to 0/);
    });

    it('should create with default options', () => {
      text = new Text(10);
      text.length.should.equal(10);
      text.ccsid.should.equal(65535);
      text.type.should.equal(DataType.TEXT);
    });

    it('should create with specified CCSID', () => {
      text = new Text(10, {ccsid: 123});
      text.ccsid.should.equal(123);
    });

  });

  describe('#toBuffer()', () => {

    it('should fail due to invalid length', () => {
      text = new Text(2);
      expect(() => {return text.toBuffer('data');}).to.throw(/Length is not valid/);
    });

    it('should convert to buffer without padding', () => {
      text = new Text(4);
      let b = text.toBuffer('data');
      should.exist(b);
      b.toString('hex').should.equal('8481a381');
      b = text.toBuffer('DATA');
      b.toString('hex').should.equal('c4c1e3c1');
    });

    it('should convert to buffer with specified ccsid', () => {
      text = new Text(4, {ccsid: 37});
      let b = text.toBuffer('data');
      should.exist(b);
      b.toString('hex').should.equal('8481a381');
    });

    it('should convert to buffer and pad', () => {
      text = new Text(10);
      let b = text.toBuffer('data');
      should.exist(b);
      b.toString('hex').should.equal('8481a381404040404040');
    });

    it('should convert to buffer with offset', () => {
      text = new Text(10);
      let b = text.toBuffer('data', { offset: 2});
      should.exist(b);
      b.toString('hex').should.equal('00008481a38140404040');
    });

    it('should convert to buffer with offset and server value', () => {
      text = new Text(10);
      let serverValue = new Buffer(10);
      serverValue.fill(0x40);
      let b = text.toBuffer('data', { serverValue: serverValue, offset: 2});
      should.exist(b);
      b.toString('hex').should.equal('40408481a38140404040');
    });

    it('should convert to buffer with server value and offset less than length', () => {
      text = new Text(10);
      let serverValue = new Buffer(20);
      serverValue.fill(0x40);
      let b = text.toBuffer('data', { serverValue: serverValue, offset: 2});
      should.exist(b);
      b.toString('hex').should.equal('40408481a3814040404040404040404040404040');
    });

    it('should convert bidi to buffer', () => {
      text = new Text(8, { ccsid: 13488 });
      let b = text.toBuffer('data');
      should.exist(b);
      b.toString('hex').should.equal('6400610074006100');
      text = new Text(8, { ccsid: 61952 });
      b = text.toBuffer('data');
      should.exist(b);
      b.toString('hex').should.equal('6400610074006100');
      text = new Text(12, { ccsid: 13488 });
      b = text.toBuffer('data');
      should.exist(b);
      b.toString('hex').should.equal('640061007400610020002000');
    });

  });

});
