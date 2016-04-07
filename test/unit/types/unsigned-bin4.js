'use strict';

import UnsignedBin4 from '../../../src/types/unsigned-bin4';
import DataType from '../../../src/types/data-type';

require('../../common');

describe('UnsignedBin4', () => {

  let uBin4;

  describe('#constructor()', () => {

    it('should create new instance', () => {
      uBin4 = new UnsignedBin4();
      uBin4.type.should.equal(DataType.UBIN4);
      uBin4.length.should.equal(4);
    });

  });

  describe('#toBuffer()', () => {

    it('should convert unsigned int to buffer', () => {
      uBin4 = new UnsignedBin4();
      let b = uBin4.toBuffer(2147483647);
      should.exist(b);
      b.toString('hex').should.equal('7fffffff');
    });

    it('should convert unsigned int to buffer with server value and padding', () => {
      uBin4 = new UnsignedBin4();
      let serverValue = new Buffer(8);
      serverValue.fill(0xFF);
      let b = uBin4.toBuffer(2147483647, { serverValue: serverValue, offset: 2 });
      should.exist(b);
      b.toString('hex').should.equal('ffff7fffffffffff');
    });

  });

});
