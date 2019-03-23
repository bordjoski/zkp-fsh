/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import bigInt from 'big-integer';
import Utils from './utils';

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
   * @param {Number} p Prime number
   * @param {Number} g Generator
   * @param {Number} pw Power. If true, produces larger randoms.
   * Careful. Affects challange size or solved challange size and verification speed
   */
  constructor(p, g = 2, pw = false) {
    this.prime = bigInt(p.toString());
    this.generator = bigInt(g);
    this.power = pw;
    if (!this.prime.isProbablePrime()) throw new Error('Invalid prime.');
    if (this.prime.bitLength() < 128) throw new Error('Prime must be at least 128bit');
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
