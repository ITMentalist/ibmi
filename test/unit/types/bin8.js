'use strict';

import Bin8 from '../../../src/types/bin8';
import DataType from '../../../src/types/data-type';

require('../../common');

describe('Bin8', () => {

  let bin8;

  describe('#constructor()', () => {

    it('should create new instance', () => {
      bin8 = new Bin8();
      bin8.type.should.equal(DataType.BIN8);
      bin8.length.should.equal(8);
    });

  });

  describe('#toBuffer()', () => {

    it('should convert long to buffer', () => {
      bin8 = new Bin8();
      let b = bin8.toBuffer('0xfedcba9876543210');
      should.exist(b);
      b.toString('hex').should.equal('fedcba9876543210');
    });

    it('should convert short to buffer with server value and padding', () => {
      bin8 = new Bin8();
      let serverValue = new Buffer(12);
      serverValue.fill(0xFF);
      let b = bin8.toBuffer('0xfedcba9876543210', { serverValue: serverValue, offset: 2 });
      should.exist(b);
      b.toString('hex').should.equal('fffffedcba9876543210ffff');
    });

  });

});
