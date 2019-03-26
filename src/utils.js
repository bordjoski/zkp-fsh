/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import forge from 'node-forge';
import bigInt from 'big-integer';
import math from 'mathjs';

/**
 * Helper methods
 */
class Utils {
  /**
   * Generate prime number
   * @param {Number} bits bit length
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
   * @param {Number} bits bit length
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
   * @param {Number} bits bit Length
   */
  static getRandomSync(bits) {
    const r = forge.random.getBytesSync(bits);
    return bigInt(forge.util.bytesToHex(r), 16);
  }

  /**
   * Get hash digests from password
   * @param {String} password Password
   * @param {String} algorithm Algorithm
   */
  static fromPassword(password, algorithm = 'md5') {
    const d = forge.md[algorithm].create().update(password).digest();
    return bigInt(parseInt(d.toHex().substr(0, 8), 16));
  }

  /**
   * If proof value is negative number, compute the inverse mod of it -
   * determinated by extended euclidean algorithm
   * @param {Integer} n g**-proof.value % p
   * @param {Integer} p Prime number
   */
  static inverseOf(n, p) {
    math.config({
      number: 'BigNumber',
      precision: Math.floor(p.bitLength() * 0.33)
    });

    const r = math.xgcd(
      math.bignumber(n.toString()),
      math.bignumber(p.toString())
    );

    // eslint-disable-next-line no-underscore-dangle
    const x = bigInt(r._data[1].toString());
    // In case r._data[1] is negative, add extra p
    // since multiplicative inverse of A in range p lies in the range [0, p-1]
    const xp = x.isNegative() ? x.plus(p) : x;
    return xp.mod(p);
  }

  /**
   * Generate prime and generator both Client and Verifier will agree to use
   * @param {Number} bits Length
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

  /**
   * Generate authentication process identifier.
   */
  static generateAuthenticationProcessId(agreement) {
    const bits = Math.floor(agreement.bitLength * agreement.strength);
    return Utils.getRandomSync(bits);
  }
}

export default Utils;
