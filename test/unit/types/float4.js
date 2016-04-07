'use strict';

import Float4 from '../../../src/types/float4';
import DataType from '../../../src/types/data-type';

require('../../common');

describe('Float4', () => {

  let float4;

  describe('#constructor()', () => {

    it('should create new instance', () => {
      float4 = new Float4();
      float4.type.should.equal(DataType.FLOAT4);
      float4.length.should.equal(4);
    });

  });

  describe('#toBuffer()', () => {

    it('should convert float to buffer', () => {
      float4 = new Float4();
      let b = float4.toBuffer(0xcafebabe);
      should.exist(b);
      b.toString('hex').should.equal('4f4afebb');
    });

    it('should convert float to buffer with server value and padding', () => {
      float4 = new Float4();
      let serverValue = new Buffer(8);
      serverValue.fill(0xFF);
      let b = float4.toBuffer(0xcafebabe, { serverValue: serverValue, offset: 2 });
      should.exist(b);
      b.toString('hex').should.equal('ffff4f4afebbffff');
    });

  });

});
