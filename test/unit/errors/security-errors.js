'use strict';

import SecurityErrors from '../../../src/errors/security-errors';

require('../../common');

describe('SecurityErrors', () => {

  describe('#get()', () => {

    it('should fail due to unknown error', () => {
      SecurityErrors.get(666).should.equal('Unknown error');
    });

    it('should get errors', () => {
      // Just test a few due to dynamic nature of get
      SecurityErrors.get(0x00010001).should.equal('Invalid random seed exchange');
      SecurityErrors.get(0x00010002).should.equal('Service ID is not valid');
      SecurityErrors.get(0x00020001).should.equal('Unknown user ID');
      SecurityErrors.get(0x00020002).should.equal('User ID is disabled');
    });

  });

});
