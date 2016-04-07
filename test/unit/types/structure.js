'use strict';

import Structure from '../../../src/types/structure';
import Text from '../../../src/types/text';
import PackedDecimal from '../../../src/types/packed-decimal';
import DataType from '../../../src/types/data-type';

require('../../common');

describe('Structure', () => {

  let struct;
  let members = [ ];

  beforeEach(() => {
    members = [ ];
    members.push(new Text(4));
    members.push(new PackedDecimal(7, 2));
  });

  describe('#constructor()', () => {

    it('should create new instance', () => {
      struct = new Structure(members);
      should.exist(struct);
      struct.type.should.equal(DataType.STRUCTURE);
      struct.members.length.should.equal(2);
      struct.length.should.equal(8);
    });

  });

  describe('#toBuffer()', () => {

    it('should convert array of values to buffer', () => {
      struct = new Structure(members);
      let values = [ 'data', 2345.69 ];
      let b = struct.toBuffer(values);
      should.exist(b);
      b.toString('hex').should.equal('8481a3810234569f');
    });

    it('should convert array of values to buffer with server value and offset', () => {
      struct = new Structure(members);
      let values = [ 'data', 2345.69 ];
      let serverValue = new Buffer(12);
      serverValue.fill(0xFF);
      let b = struct.toBuffer(values, { serverValue: serverValue, offset: 2} );
      should.exist(b);
      b.toString('hex').should.equal('ffff8481a3810234569fffff');
    });

  });

});
