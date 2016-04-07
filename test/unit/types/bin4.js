'use strict';

import Bin4 from '../../../src/types/bin4';
import DataType from '../../../src/types/data-type';

require('../../common');

describe('Bin4', () => {

  let bin4;

  describe('#constructor()', () => {

    it('should create new instance', () => {
      bin4 = new Bin4();
      bin4.type.should.equal(DataType.BIN4);
      bin4.length.should.equal(4);
    });

  });

  describe('#toBuffer()', () => {

    it('should convert int to buffer', () => {
      bin4 = new Bin4();
      let b = bin4.toBuffer(2147483647);
      should.exist(b);
      b.toString('hex').should.equal('7fffffff');
    });

    it('should convert int to buffer with server value and padding', () => {
      bin4 = new Bin4();
      let serverValue = new Buffer(8);
      serverValue.fill(0xFF);
      let b = bin4.toBuffer(2147483647, { serverValue: serverValue, offset: 2 });
      should.exist(b);
      b.toString('hex').should.equal('ffff7fffffffffff');
    });

  });

});
