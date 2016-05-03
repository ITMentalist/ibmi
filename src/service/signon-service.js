'use strict';

import Service from './service';
import SecurityErrors from '../errors/security-errors';
import { SignonSeedExchangeRequest, SignonSeedExchangeResponse } from '../packet/signon-seed-exchange';
import { SignonInfoRequest, SignonInfoResponse } from '../packet/signon-info';
import PasswordEncryptor from '../util/password-encryptor';

const debug = require('debug')('ibmi:service:signon-service');
let error = require('debug')('ibmi:service:signon-service:error');
error.color = 1;

/**
 * Signon service.
 */
export default class SignonService extends Service {

  static get SERVICE() {
    return {
      name: 'as-signon',
      id: 0xE009,
      defaultPort: 8476,
      defaultTLSPort: 9476
    };
  }

  /**
   * Constructor.
   * @constructor
   */
  constructor(system) {
    super(system, SignonService.SERVICE);
    debug('Signon service created to %s with connection ID %d, service = %j', this.system.hostName, this.connectionId, SignonService.SERVICE);
  }

  /**
   * Perform a signon.
   */
  async signon() {
    debug('Attempt to signon as %s to %s, connection ID = %d', this.system.userId, this.system.hostName, this.connectionId);
    let res;
    try {
      this.connection = await this.connect();
      let serverSeed = await this.exchangeSeeds();
      res = await this.info(serverSeed);
    } catch(err) {
      error('Failed to signon: %s', err);
      throw(err);
    }
    return res;
  }

  /**
   * Exchange seeds.
   */
  exchangeSeeds() {
    return new Promise((resolve, reject) => {
      debug('Attempt to exchange seeds with %s', this.system.hostName);
      let req = new SignonSeedExchangeRequest();
      this.seed = req.clientSeed;
      this.socket.once('data', this.handleSeedExchangeResponse.bind(this, resolve, reject));
      this.sendPacket(req);
    });
  }

  /**
   * Get signon info.
   */
  info(serverSeed) {
    return new Promise((resolve, reject) => {
      debug('Attempt to get signon info from %s', this.system.hostName);
      let encryptor = new PasswordEncryptor(this.system.passwordLevel);
      let encryptedPassword = encryptor.encrypt(this.system.userId, this.system.password, this.seed, serverSeed);
      let req = new SignonInfoRequest(this.system.userId, encryptedPassword, this.system.serverLevel, this.socket);
      this.socket.once('data', this.handleInfoResponse.bind(this, resolve, reject));
      this.sendPacket(req);
    });
  }

  handleSeedExchangeResponse(resolve, reject, data) {
    debug('Seed exchange response received from %s: %s', this.system.hostName, data.toString('hex'));
    if (data.length < 24) {
      error('Invalid seed exchange response received from %s', this.system.hostName);
      reject(new Error('Invalid seed exchange response received from ' + this.system.hostName));
    } else {
      let resp = new SignonSeedExchangeResponse(data);
      debug('Signon seed exchange response code from %s is %d', this.system.hostName, resp.rc);
      if (resp.rc !== 0) {
        error('Error received during signon seed exchange with %s: %d', this.system.hostName, resp.rc);
        reject(new Error('Error received during signon seed exchange with ' + this.system.hostName + ' : ' + resp.rc));
      } else {
        this.system.serverLevel = resp.serverLevel;
        this.system.serverVersion = resp.serverVersion;
        this.system.passwordLevel = resp.passwordLevel;
        this.system.passwordAttributesSet = true;

        debug('Seed exchange server level from %s: %d', this.system.hostName, this.system.serverLevel);
        debug('Seed exchange server version from %s: %d', this.system.hostName, this.system.serverVersion);
        debug('Seed exchange server seed from %s: %s', this.system.hostName, resp.serverSeed.toString('hex'));
        debug('Seed exchange password level from %s: %d', this.system.hostName, this.system.passwordLevel);

        resolve(resp.serverSeed);
      }
    }
  }

  handleInfoResponse(resolve, reject, data) {
    debug('Info response received from %s: %s', this.system.hostName, data.toString('hex'));
    if (data.length < 24) {
      error('Invalid info response received from %s', this.system.hostName);
      reject(new Error('Invalid info response received from ' + this.system.hostName));
    } else {
      let resp = new SignonInfoResponse(data);
      debug('Info response return code from %s is %d ', this.system.hostName, resp.rc);
      if (resp.rc !== 0) {
        error('Error received during signon info with %s: %s', this.system.hostName, SecurityErrors.get(resp.rc));
        reject(new Error('Error received during signon info with ' + this.system.hostName + ' : ' + SecurityErrors.get(resp.rc)));
      } else {
        let res = {
          serverCCSID: resp.serverCCSID,
          currentSignonDate: resp.currentSignonDate,
          lastSignonDate: resp.lastSignonDate,
          passwordExpirationDate: resp.passwordExpirationDate,
          expirationWarning: resp.expirationWarning,
          userId: resp.userId
        };
        debug('Info response from %s: %j', this.system.hostName, res);
        resolve(res);
      }
    }
  }

}
