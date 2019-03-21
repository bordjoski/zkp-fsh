/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import forge from 'node-forge';
import bigInt from 'big-integer';

/**
 * Utils class provides helper methods for calculating prime numbers
 */
class Utils {
  static async generateAgreement(bits) {
    const p = await Utils.getPrime(bits);
    const g = 2;
    return {
      prime: p,
      generator: g
    };
  }
  /**
   * Returns random large prime number both initiator
   * and verifier will agree to use.
   */
  static async getPrime(bits = 1024) {
    return new Promise((resolve, reject) => {
      const opts = {
        algorithm: {
          name: 'PRIMEINC',
          workers: -1
        }
      };
      forge.prime.generateProbablePrime(bits, opts, (err, num) => {
        if (err) {
          reject(err);
        }
        resolve(num);
      });
    });
  }

  static async getRandomAsync(bytes) {
    return new Promise((resolve, reject) => {
      forge.random.getBytes(bytes, (err, r) => {
        if (err) {
          reject(err);
        }
        resolve(bigInt(forge.util.bytesToHex(r), 16));
      });
    });
  }

  static getRandomSync(bytes) {
    const r = forge.random.getBytesSync(bytes);
    return bigInt(forge.util.bytesToHex(r), 16);
  }

  static fromPassword(value, method = 'md5') {
    const md = forge.md[method].create();
    md.update(value);
    return parseInt(md.digest().toHex().substr(0, 8), 16);
  }
}

export default Utils;
