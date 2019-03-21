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
   */
  constructor(p, g = 2) {
    this.prime = bigInt(p.toString());
    this.generator = bigInt(g);
    if (!this.prime.isProbablePrime()) throw new Error('Invalid prime.');
    if (this.prime.bitLength() < 32) throw new Error('You are Optimus Prime!');
  }

  /**
   * @private
   */
  generateRandom() {
    const bits = this.prime.bitLength();
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
