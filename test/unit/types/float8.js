'use strict';

import Float8 from '../../../src/types/float8';
import DataType from '../../../src/types/data-type';

require('../../common');

describe('Float8', () => {

  let float8;

  describe('#constructor()', () => {

    it('should create new instance', () => {
      float8 = new Float8();
      float8.type.should.equal(DataType.FLOAT8);
      float8.length.should.equal(8);
    });

  });

  describe('#toBuffer()', () => {

    it('should convert double to buffer', () => {
      float8 = new Float8();
      let b = float8.toBuffer(0xdeadbeefcafebabe);
      should.exist(b);
      b.toString('hex').should.equal('43ebd5b7ddf95fd7');
    });

    it('should convert float to buffer with server value and padding', () => {
      float8 = new Float8();
      let serverValue = new Buffer(12);
      serverValue.fill(0xFF);
      let b = float8.toBuffer(0xdeadbeefcafebabe, { serverValue: serverValue, offset: 2 });
      should.exist(b);
      b.toString('hex').should.equal('ffff43ebd5b7ddf95fd7ffff');
    });

  });

});
