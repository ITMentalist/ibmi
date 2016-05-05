'use strict';

export default class DataQueueService {

  constructor(system) {
    this.system = system;
    this.writeError = false;
    this.createError = false;
    this.deleteError = false;
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

  write(name, library, key, data) {
    return new Promise((resolve, reject) => {
      if (this.writeError) {
        reject(Error('Write error'));
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
