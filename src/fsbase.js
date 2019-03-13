/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

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
  constructor(p, g, r = 0) {
    this.prime = p;
    this.generator = g;
    this.random = r === 0
      ? Utils.getRandomValue(this.prime)
      : r;
  }
}

export default FSBase;
