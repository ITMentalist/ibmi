'use strict';

import Service from './service';
import { RemoteCommandExchangeAttributesRequest, RemoteCommandExchangeAttributesResponse } from '../packet/remote-command-exchange-attributes';
import Converter from '../types/converter';

const debug = require('debug')('ibmi:service:remote-command-service');
let error = require('debug')('ibmi:service:remote-command-service:error');
error.color = 1;

export default class RemoteCommandService extends Service {

  static get SERVICE() {
    return {
      name: 'as-rmtcmd',
      id: 0xE008,
      defaultPort: 8475,
      defaultTLSPort: 9475
    };
  }

  /**
   * Constructor.
   * @constructor
   */
  constructor(system) {
    super(system, RemoteCommandService.SERVICE);
    this.attributesExchanged = false;
    debug('Remote command service created to %s with connection ID %d, service = %j', this.system.hostName, this.connectionId, RemoteCommandService.SERVICE);
  }

  async getJobInfo() {
    debug('Getting job info from %s', this.system.hostName);
    let res;
    try {
      await this.open();
      debug('Job string: %s', this.connection.jobString);
      let info = this.connection.jobString.split('/');
      let jobInfo = '';
      jobInfo += info[2].trim();
      while (jobInfo.length < 10) {
        jobInfo += ' ';
      }
      jobInfo += info[1].trim();
      while (jobInfo.length < 20) {
        jobInfo += ' ';
      }
      jobInfo += info[0].trim();
      while (jobInfo.length < 26) {
        jobInfo += ' ';
      }
      debug('Job info: %s', jobInfo);
      res = jobInfo;
    } catch (err) {
      error('Failed to get job info: %s', err);
      throw (err);
    }
    return res;
  }

  async open() {
    try {
      this.connection = await this.connect();
      if (!this.attributesExchanged) {
        await this.exchangeAttributes();
      }
    } catch (err) {
      error('Failed to open: %s', err);
      this.disconnect();
      throw(err);
    }
  }

  exchangeAttributes() {
    return new Promise((resolve, reject) => {
      debug('Attempting to exchange attributes with %s', this.system.hostName);
      let req = new RemoteCommandExchangeAttributesRequest(this.system.nlv);
      req.correlationId = this.connectionId;
      this.socket.once('data', this.handleExchangeAttributesResponse.bind(this, resolve, reject));
      this.sendPacket(req);
    });
  }

  handleExchangeAttributesResponse(resolve, reject, data) {
    debug('Exchange attributes response receved from %s: %s', this.system.hostName, data.toString('hex'));
    if (data.length < 21) {
      error('Invalid exchange attributes response received from %s', this.system.hostName);
      reject(new Error('Invalid exchange attributes response received from ' + this.system.hostName));
    } else {
      let resp = new RemoteCommandExchangeAttributesResponse(data);
      debug('Exchange attributes response code from %s is %d', this.system.hostName, resp.rc);
      if (resp.rc !== 0 && resp.rc !== 0x100) {
        error('Error received during exchange attributes with %s: %d', this.system.hostName, resp.rc);
        reject(new Error('Error received during exchange attributes with ' + this.system.hostName + ' : ' + resp.rc));
      } else {
        this.serverDataStreamLevel = resp.dsLevel;
        debug('Data stream level from %s is %d', this.system.hostName, this.serverDataStreamLevel);
        this.converter = new Converter({
          ccsid: resp.ccsid
        });
        if (this.serverDataStreamLevel >= 10) {
          this.unicodeConverter = new Converter({
            ccsid: 1200
          });
        }
        this.attributesExchanged = true;
        resolve(true);
      }
    }
  }

}
