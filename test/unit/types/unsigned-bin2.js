'use strict';

import UnsignedBin2 from '../../../src/types/unsigned-bin2';
import DataType from '../../../src/types/data-type';

require('../../common');

describe('UnsignedBin2', () => {

  let uBin2;

  describe('#constructor()', () => {

    it('should create new instance', () => {
      uBin2 = new UnsignedBin2();
      uBin2.type.should.equal(DataType.UBIN2);
      uBin2.length.should.equal(2);
    });

  });

  describe('#toBuffer()', () => {

    it('should convert unsigned short to buffer', () => {
      uBin2 = new UnsignedBin2();
      let b = uBin2.toBuffer(50);
      should.exist(b);
      b.toString('hex').should.equal('0032');
    });

    it('should convert unsigned short to buffer with server value and offset', () => {
      uBin2 = new UnsignedBin2();
      let serverValue = new Buffer(6);
      serverValue.fill(0xFF);
      let b = uBin2.toBuffer(50, { serverValue: serverValue, offset: 2 });
      should.exist(b);
      b.toString('hex').should.equal('ffff0032ffff');
    });

  });

});
