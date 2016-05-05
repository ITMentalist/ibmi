'use strict';

import Converter from '../../../src/types/converter';

require('../../common');

describe('Converter', () => {

  let converter;

  describe('#constructor()', () => {

    it('should create with default options', () => {
      converter = new Converter();
      converter.ccsid.should.equal(37);
    });

    it('should create with specified ccsid', () => {
      converter = new Converter({ccsid: 123});
      converter.ccsid.should.equal(123);
    });

  });

  describe('#stringToBuffer()', () => {

    beforeEach(() => {
      converter = new Converter();
    });

    it('should convert string to buffer', () => {
      let b = converter.stringToBuffer('somestring');
      should.exist(b);
      b.toString('hex').should.equal('a2969485a2a399899587');
    });

  });

  describe('#bufferToString()', () => {

    beforeEach(() => {
      converter = new Converter();
    });

    it('should not convert', () => {
      let s = converter.bufferToString(null);
      should.not.exist(s);
    });

    it('should convert buffer to string', () => {
      let b = new Buffer('a2969485a2a399899587', 'hex');
      let s = converter.bufferToString(b);
      should.exist(s);
      s.should.equal('somestring');
    });

  });

});
