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
  constructor(p, g = 2) {
    this.prime = bigInt(p.toString());
    this.generator = bigInt(g);
    this.random = this.generateRandom();
  }

  /**
   * @private
   */
  generateRandom() {
    return this.getDirt(256);
  }

  // -----------temporary fix:
  /**
   * Dirty fix made to be able to test larger primes and randoms.
   * Speed out of focus
   * Randoms should be generated with random bytes method from crypto or forge PRNG
   */
  getDirt(bits, n = 1) {
    let m = 33;
    let s = '';
    while (m > 0) {
      s += this.getPartOf(Math.floor(bits / n)).toString().split('n').join('');
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
  // ----------- end of temporary fix
}

export default FSBase;
