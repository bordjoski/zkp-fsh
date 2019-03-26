/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import forge from 'node-forge';
import bigInt from 'big-integer';

/**
 * Helper methods
 */
class Utils {
  /**
   * Generate prime number with given bit length
   * @param {Number} bits Length
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
        if (err) reject(err);
        resolve(num);
      });
    });
  }

  /**
   * Generate random - async
   * @param {Number} bits Length
   */
  static async getRandomAsync(bits) {
    return new Promise((resolve, reject) => {
      forge.random.getBytes(bits, (err, r) => {
        if (err) reject(err);
        resolve(bigInt(forge.util.bytesToHex(r), 16));
      });
    });
  }

  /**
   * Generate random - sync
   * @param {Number} bits Length
   */
  static getRandomSync(bits) {
    const r = forge.random.getBytesSync(bits);
    return bigInt(forge.util.bytesToHex(r), 16);
  }

  /**
   * @private
   * md
   * @param {String} value Password
   * @param {String} md Algorithm
   */
  static fromPassword(value, md = 'md5') {
    const d = forge.md[md].create().update(value).digest();
    return bigInt(parseInt(d.toHex().substr(0, 8), 16));
  }

  /**
   * Generate prime and generator both Client and Verifier will agree to use
   * @param {Number} bits Length
   * @private
   */
  static async generateAgreementValues(bits) {
    return new Promise((resolve, reject) => {
      Utils.getPrime(bits).then((p) => {
        resolve({
          prime: p.toString(),
          generator: 2
        });
      }).catch((e) => {
        reject(e);
      });
    });
  }
}

export default Utils;
