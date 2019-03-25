/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import bigInt from 'big-integer';
import Utils from './utils';
import Agreement from './agreement';

/**
 * FSBase class is base class for Verifier and Client
 */
class FSBase {
  static get ACCEPTABLE_DIGEST() {
    return {
      md5: true,
      sha1: true,
      sha256: true,
      sha384: true,
      sha512: true
    };
  }
  static get MAX_POWER() { return 1.5; }
  /**
   * @param {Object} agreement Agreement agreed between Client and Verifier
   * @param {Boolean} power If true, produces larger randoms.
   * Careful. Affects challange size or solved challange size and verification speed
   */
  constructor(agreement, power = false) {
    this.prime = bigInt(agreement.prime);
    this.generator = bigInt(agreement.generator);
    this.power = power;
    if (!this.prime.isProbablePrime()) {
      throw new Error('Invalid prime');
    }
    if (this.prime.bitLength() < Agreement.MIN_LENGTH) {
      throw new Error(`Agreement must be initialized with at least ${Agreement.MIN_LENGTH}bit prime`);
    }
  }

  /**
   * @private
   */
  generateRandom() {
    const bits = this.power
      ? Math.floor(this.prime.bitLength() * FSBase.MAX_POWER)
      : this.prime.bitLength();
    return Utils.getRandomSync(bits);
  }

  /**
   * @private
   */
  setRandom(v) {
    this.random = bigInt(v);
  }
}

export default FSBase;
