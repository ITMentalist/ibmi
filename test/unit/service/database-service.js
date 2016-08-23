'use strict';

import DatabaseService from '../../../src/service/database-service';
import IBMi from '../../../src/ibmi';

require('../../common');

describe('DatabaseService', () => {

  let databaseService, system;

  beforeEach(() => {
    system = new IBMi({
      hostName: 'localhost',
      userId: 'GOOD',
      password: 'GOOD'
    });
    databaseService = new DatabaseService(system);
  });

  describe('#constructor()', () => {

    it('should fail to create instance due to invalid parameters', () => {
      expect(() => {return new DatabaseService();}).to.throw(/Invalid IBMi system/);
      expect(() => {return new DatabaseService({});}).to.throw(/Invalid IBMi system/);
    });

    it('should create new instance', () => {
      databaseService = new DatabaseService(system);
      should.exist(databaseService.connectionId);
    });

  });

});
