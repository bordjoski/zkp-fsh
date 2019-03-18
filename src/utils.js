/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import forge from 'node-forge';

/**
 * Utils class provides helper methods for calculating prime numbers
 */
class Utils {
  static async generateAgreement() {
    const p = await Utils.getPrime();
    const g = 2;
    return {
      prime: p,
      generator: g
    };
  }
  /**
   * Returns random large prime number both initiator
   * and verifier will agree to use.
   */
  static async getPrime(bits = 1024) {
    return new Promise((resolve, reject) => {
      // generate a random prime on the main JS thread
      forge.prime.generateProbablePrime(bits, (err, num) => {
        if (err) {
          reject(err);
        }
        resolve(num);
      });
    });
  }

  /**
   * Get random value in range of given number
   * @param {Number} max Agreed prime number
   */
  static getRandomValue(max) {
    return Utils.inRange(1, max);
  }

  /**
   * Returns random number in given range
   * @param {Number} min
   * @param {Number} max
   */
  static inRange(min, max) {
    const minx = Math.ceil(min);
    const maxx = Math.floor(max);
    return Math.floor(Math.random() * ((maxx - minx) + 1)) + minx;
  }
}

export default Utils;
