'use strict';

import Environment from '../../../src/util/environment';

require('../../common');

describe('Environment', () => {

  let localeSave;

  beforeEach(() => {
    localeSave = process.env.LANG;
  });

  afterEach(() => {
    process.env.LANG = localeSave;
  });

  describe('#getNlv()', () => {

    it('should get nlv from default locale', () => {
      let nlv = Environment.getNlv(process.env.LANG);
      should.exist(nlv);
      nlv.should.equal('2924');
    });

    it('should get default nlv due to locale not found', () => {
      process.env.LANG = 'bad';
      let nlv = Environment.getNlv(process.env.LANG);
      should.exist(nlv);
      nlv.should.equal('2924');
    });

  });

  describe('#getCcsid()', () => {

    it('should get ccsid from locale', () => {
      let ccsid = Environment.getCcsid();
      should.exist(ccsid);
      ccsid.should.equal(37);
    });

    it('should get default ccsid due to locale not found', () => {
      process.env.LANG = 'bad';
      let ccsid = Environment.getCcsid();
      should.exist(ccsid);
      ccsid.should.equal(37);
    });

  });

});
