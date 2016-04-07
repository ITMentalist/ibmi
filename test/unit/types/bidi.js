'use strict';

import Bidi from '../../../src/types/bidi';

require('../../common');

describe('Bidi', () => {

  describe('#constants', () => {

    it('constants should be set', () => {
      Bidi.BIDI_TABLE.size.should.equal(2);
      Bidi.ST10.should.equal(10);
    });

  });

  describe('#isBidiCcsid()', () => {

    it('should not be bidi', () => {
      Bidi.isBidiCcsid(37).should.equal(false);
    });

    it('should be bidi', () => {
      Bidi.isBidiCcsid(13488).should.equal(true);
    });

  });

});
