'use strict';

import Text from '../../../src/types/text';

require('../../common');

describe('Text', () => {

  let text;

  describe('#constructor()', () => {

    it('should fail to create due to invalid length', () => {
      expect(() => {return new Text();}).to.throw(/Length must be a number/);
      expect(() => {return new Text('1');}).to.throw(/Length must be a number/);
      expect(() => {return new Text(-1);}).to.throw(/Length must be greater than or equal to 0/);
    });

    it('should create with default options', () => {
      text = new Text(10);
      text.length.should.equal(10);
    });

  });

});
