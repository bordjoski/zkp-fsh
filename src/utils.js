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
   * Supported message digest algorithms
   */
  static get SUPPORTED_ALGORITHMS() {
    return {
      md5: 'md5',
      sha1: 'sha1',
      sha256: 'sha256',
      sha384: 'sha384',
      sha512: 'sha512'
    };
  }

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
   * Generate random - sync
   * @param {Number} bits bit Length
   * @param {Array} collected Optional. Used for collected entropy.
   * @param {String} randomBytes Optional. Used for collected entropy.
   */
  static getRandom(bits, collected, randomBytes) {
    const prngInstance = forge.random.createInstance();
    if (randomBytes) prngInstance.collect(randomBytes);
    if (collected) collected.forEach(c => prngInstance.collectInt(c, 16));
    const r = prngInstance.getBytesSync(bits);
    return bigInt(forge.util.bytesToHex(r), 16);
  }

  /**
   * Get hash digests from password
   * @param {String} password Password
   * @param {String} algorithm Algorithm
   */
  static fromPassword(password, algorithm = 'md5') {
    if (!Utils.SUPPORTED_ALGORITHMS[algorithm]) {
      const supported = Object.keys(Utils.SUPPORTED_ALGORITHMS).toString();
      throw new Error(`Unsuported algorithm ${algorithm}. Supported message digest algorithms are: ${supported}`);
    }
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
  static async generateAgreementValues(bits, generator) {
    if (generator < 2) throw new Error('Invalid generator');
    return new Promise((resolve, reject) => {
      Utils.getPrime(bits).then((p) => {
        resolve({
          prime: p.toString(),
          generator
        });
      }).catch((e) => {
        reject(e);
      });
    });
  }

  /**
   * Generate authentication process identifier.
   * @param {Agreement} agreement Agreement
   * @param {Array} collected Optional. Used for collected entropy.
   * @param {String} randomBytes Optional. Used for collected entropy.
   */
  static generateAuthProcessId(agreement, collected, randomBytes) {
    const bits = Math.floor(agreement.bitLength * agreement.strength);
    return Utils.getRandom(bits, collected, randomBytes);
  }
}

export default Utils;
