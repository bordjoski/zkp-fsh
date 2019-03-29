/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import crypto from 'crypto';
import bigInt from 'big-integer';

/**
 * Helper methods
 */
class Utils {
  /**
   * Generate prime number
   * @param {Number} bits bit length
   */
  static getPrime(bits = 1024) {
    const df = crypto.createDiffieHellman(bits);
    return bigInt(df.getPrime('hex'), 16);
  }

  /**
   * Generate random - async
   * @param {Number} bits Length
   */
  static async getRandomAsync(bits) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(bits, (err, buf) => {
        if (err) reject(err);
        resolve(bigInt(buf.toString('hex'), 16));
      });
    });
  }

  /**
   * Generate random - sync
   * @param {Number} bits Length
   */
  static getRandomSync(bits) {
    const buf = Buffer.alloc(bits);
    return bigInt(crypto.randomFillSync(buf).toString('hex'), 16);
  }

  /**
   * Get hash digests from password
   * @param {String} password Password
   * @param {String} algorithm Algorithm
   */
  static fromPassword(value, md = 'md5') {
    const d = crypto.createHash(md).update(value).digest('hex');
    return bigInt(parseInt(d.substr(0, 8), 16));
  }

  /**
   * If proof value is negative number, compute the inverse mod of it -
   * determinated by extended euclidean algorithm
   * @param {Integer} n g**-proof.value % p
   * @param {Integer} p Prime number
   */
  static inverseOf(n, p) {
    const x = n.modInv(p);
    // In case x is negative, add extra p
    // since multiplicative inverse of n in range p lies in the range [0, p-1]
    const xp = x.isNegative() ? x.plus(p) : x;
    return xp.mod(p);
  }

  /**
   * Generate agreement values
   * @param {Number} bits Length
   */
  static async generateAgreementValues(bits) {
    return new Promise((resolve) => {
      resolve({
        prime: Utils.getPrime(bits).toString(),
        generator: 2
      });
    });
  }

  /**
   * Generate authentication process identifier.
   */
  static generateAuthProcessId(agreement) {
    const bits = Math.floor(agreement.bitLength * agreement.strength);
    return Utils.getRandomSync(bits);
  }
}

export default Utils;
