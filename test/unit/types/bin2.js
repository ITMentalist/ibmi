'use strict';

import Bin2 from '../../../src/types/bin2';
import DataType from '../../../src/types/data-type';

require('../../common');

describe('Bin2', () => {

  let bin2;

  describe('#constructor()', () => {

    it('should create new instance', () => {
      bin2 = new Bin2();
      bin2.type.should.equal(DataType.BIN2);
      bin2.length.should.equal(2);
    });

  });

  describe('#toBuffer()', () => {

    it('should convert short to buffer', () => {
      bin2 = new Bin2();
      let b = bin2.toBuffer(50);
      should.exist(b);
      b.toString('hex').should.equal('0032');
    });

    it('should convert short to buffer with server value and offset', () => {
      bin2 = new Bin2();
      let serverValue = new Buffer(6);
      serverValue.fill(0xFF);
      let b = bin2.toBuffer(50, { serverValue: serverValue, offset: 2 });
      should.exist(b);
      b.toString('hex').should.equal('ffff0032ffff');
    });

  });

});
