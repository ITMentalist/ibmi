'use strict';

import { ChangePasswordRequest, ChangePasswordResponse } from '../../../src/packet/change-password';

require('../../common');

describe('ChangePasswordRequest', () => {

  describe('#constructor()', () => {

    it('should fail due to invalid parameters', () => {
      expect(() => {return new ChangePasswordRequest();}).to.throw(/Invalid user ID/);
      expect(() => {return new ChangePasswordRequest('USER');}).to.throw(/Invalid old password/);
      expect(() => {return new ChangePasswordRequest('USER', 'OLDPASS');}).to.throw(/Invalid new password/);
      expect(() => {return new ChangePasswordRequest('USER', 'OLDPASS', 'NEWPASS');}).to.throw(/Invalid encrypted password/);
      expect(() => {return new ChangePasswordRequest('USER', 'OLDPASS', 'NEWPASS', new Buffer(10));}).to.throw(/Invalid server level/);
    });

    it('should create new instance', () => {
      let user = 'USER';
      let oldPassword = 'OLDPASS';
      let newPassword = 'NEWPASS';
      let encryptedPassword = new Buffer(8);
      encryptedPassword.fill(0xFF);
      let p = new ChangePasswordRequest(user, oldPassword, newPassword, encryptedPassword, 10);
      p.length.should.equal(84);
      p.serviceId.should.equal(0xE009);
      p.requestResponseId.should.equal(0x7005);
      p.templateLength.should.equal(1);
      p.data[20].should.equal(0x01);
      p.userId.should.equal('USER');
      console.log(p.data.toString('hex'));
    });

  });

});
