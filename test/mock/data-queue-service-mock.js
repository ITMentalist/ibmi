'use strict';

export default class DataQueueService {

  constructor(system) {
    this.system = system;
    this.writeError = false;
    this.createError = false;
    this.deleteError = false;
    this.clearError = false;
    this.readError = false;
    this.readEmpty = false;
  }

  create(name, library, entryLength, authority, saveSenderInfo, fifo, keyLength, forceStorage, description) {
    return new Promise((resolve, reject) => {
      if (this.createError) {
        reject(new Error('Create error'));
      } else {
        resolve(true);
      }
    });
  }

  read(name, library, search, wait, peek, key) {
    return new Promise((resolve, reject) => {
      if (this.readError) {
        reject(new Error('Read error'));
      } else {
        if (this.readEmpty) {
          resolve(null);
        } else {
          resolve({
            senderInfo: new Buffer('SENDER'),
            entry: new Buffer('ENTRY'),
            key: new Buffer('KEY'),
            converter: {
            }
          });
        }
      }
    });
  }

  write(name, library, key, data) {
    return new Promise((resolve, reject) => {
      if (this.writeError) {
        reject(Error('Write error'));
      } else {
        resolve(true);
      }
    });
  }

  clear(name, library, key) {
    return new Promise((resolve, reject) => {
      if (this.clearError) {
        reject(Error('Clear error'));
      } else {
        resolve(true);
      }
    });
  }

  delete(name, library) {
    return new Promise((resolve, reject) => {
      if (this.deleteError) {
        reject(Error('Delete error'));
      } else {
        resolve(true);
      }
    });
  }

  disconnect() {
  }

  static get SERVICE() {
    return {
      name: 'as-dtaq',
      id: 0xE007,
      defaultPort: 8472,
      defaultTLSPort: 9472
    };
  }

}
