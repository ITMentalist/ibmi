export default class SignonService {

  constructor(system) {
    this.system = system;
  }

  signon() {
    return new Promise((resolve, reject) => {
      if (this.system.userId == 'GOOD') {
        this.system.passwordLevel = 1;
        resolve({
          serverCCSID: 37
        });
      } else {
        reject(new Error('ERROR'));
      }
    });
  }

  disconnect() {
  }

  static get SERVICE() {
    return {
      name: 'as-signon',
      id: 0xE009,
      defaultPort: 8476,
      defaultTLSPort: 9476
    };
  }

}
