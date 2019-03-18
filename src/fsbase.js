/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import bigInt from 'big-integer';
import Utils from './utils';

/**
 * FSBase class is base class for Verifier and Client
 */
class FSBase {
  /**
   * @param {Number} p Prime number
   * @param {Number} g Generator
   * @param {Number} r Random number
   */
  constructor(p, g = 2) {
    this.prime = bigInt(p.toString());
    this.generator = bigInt(g);
    this.random = this.generateRandom();
  }

  /**
   * @private
   */
  generateRandom() {
    const pBits = Buffer.byteLength(this.prime.toString(16), 'utf8');
    let m = Math.floor(pBits / 256);
    let s = '';
    while (m > 0) {
      s += this.getPartOf(256).toString().split('n').join('');
      m -= 1;
    }
    return bigInt(s);
  }

  /**
   * @private
   */
  getPartOf(bits) {
    return bigInt(Utils.getRandomValue(this.prime.toString().substr(
      0,
      Math.floor(this.prime.toString().length / (Math.floor(this.prime.toString().length / bits)))
    )));
  }
}

export default FSBase;
