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
  constructor(p, g = 2, r = 0) {
    this.prime = bigInt(p.toString());
    this.generator = bigInt(g);
    this.random = r === 0
      ? this.getRandom()
      : bigInt(r);
  }

  getRandom() {
    return this.random
      ? this.random
      : bigInt(Utils.getRandomValue(this.prime));
  }
}

export default FSBase;
