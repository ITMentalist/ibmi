'use strict';

import PasswordEncryptor from '../../../src/util/password-encryptor';

require('../../common');

describe('PasswordEncryptor', () => {

  let encryptor;
  let clientSeed = new Buffer([0x27, 0x88, 0x4b, 0x0b, 0x27, 0x99, 0x07, 0xf0]);
  let serverSeed = new Buffer([0xd0, 0xae, 0xd6, 0xfd, 0xea, 0xda, 0xe0, 0xb9]);

  describe('#encrypt()', () => {

    it('should encrypt password 8 chars or less with user ID 8 chars or less via DES', function() {
      encryptor = new PasswordEncryptor(0);
      let encrypted = encryptor.encrypt('USER', 'PASS', clientSeed, serverSeed);
      encrypted.toString('hex').should.equal('6700b9ef3dacc1cb');
    });

    it('should encrypt password greater than 8 chars with user ID 8 chars or less via DES', function() {
      encryptor = new PasswordEncryptor(0);
      let encrypted = encryptor.encrypt('USER', 'TESTPASSWD', clientSeed, serverSeed);
      encrypted.toString('hex').should.equal('21677e5713d1928f');
    });

    it('should encrypt password 8 chars or less with user ID greater than 8 chars via DES', function() {
      encryptor = new PasswordEncryptor(0);
      let encrypted = encryptor.encrypt('TESTUSERID', 'PASS', clientSeed, serverSeed);
      encrypted.toString('hex').should.equal('d2004bb9d8796bab');
    });

    it('should encrypt password greater than 8 chars with user ID greater than 8 chars via DES', function() {
      encryptor = new PasswordEncryptor(0);
      let encrypted = encryptor.encrypt('TESTUSERID', 'TESTPASSWD', clientSeed, serverSeed);
      encrypted.toString('hex').should.equal('08c97a938cb59de0');
    });

    it('should encrypt password vi SHA1', function() {
      encryptor = new PasswordEncryptor(2);
      let encrypted = encryptor.encrypt('USER', 'PASS', clientSeed, serverSeed);
      encrypted.toString('hex').should.equal('84aadc0f0a5591d6c8e19cc44791f0e8ddcf5909');
    });

  });

});
