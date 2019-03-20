/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import bigInt from 'big-integer';
import Utils from './utils';

/**
 * FSBase class is base class for Verifier and Client
 */
class FSBase {
  static get ACCEPTABLE_METHODS() {
    return {
      md5: true,
      sha384: true
    };
  }
  /**
   * @param {Number} p Prime number
   * @param {Number} g Generator
   * @param {Number} r Random number
   */
  constructor(p, g = 2, r = 0) {
    this.prime = bigInt(p.toString());
    this.generator = bigInt(g);
    this.random = r === 0
      ? this.generateRandom()
      : this.setRandom(r);
  }

  /**
   * @private
   */
  generateRandom() {
    const bits = this.prime.bitLength();
    return Utils.getRandomSync(bits);
  }

  setRandom(v) {
    this.random = bigInt(v);
  }
}

export default FSBase;
