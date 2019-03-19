/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import bigInt from 'big-integer';
import forge from 'node-forge';
import FSBase from './fsbase';

/**
 * Helper methods enabling user to prove identity without
 * compromising the password and without shared or public keys.
 * Client class is responsible for:
 * 1. calculation of registration value
 * 2. calculation of sign in value
 * 3. solving a challange given by verifier
 */
class Client extends FSBase {
  constructor(p, g = 2, m = 'md5') {
    super(p, g);
    if (!FSBase.ACCEPTABLE_METHODS[m]) {
      const methods = Object.keys(FSBase.ACCEPTABLE_METHODS).toString();
      throw new Error(`Unsuported method ${m}. Supported methods are: ${methods}`);
    }
    this.method = m;
  }
  /**
   * Calculate value to be used for registration purpose.
   * @param {String} password Choosen password
   */
  getRegistrationValue(password) {
    const x = this.calculateSecret(password);
    return this.generator.modPow(x, this.prime);
  }

  /**
   * Get initial value for sign in process.
   */
  getSignInValue() {
    return this.generator.modPow(this.random, this.prime);
  }

  /**
   * Solves a challange given by verifier.
   * @param {String} password Choosen password
   * @param {Number} challange Random number given by verifier
   */
  solveChallange(password, challange) {
    const x = this.calculateSecret(password);
    return this.random.minus(bigInt(challange).multiply(x));
  }

  /**
   * Calculate the secret based on password and prime number.
   * @param {String} password Choosen password
   * @private
   */
  calculateSecret(password) {
    const md = forge.md[this.method].create();
    md.update(password);
    return bigInt(parseInt(md.digest().toHex().substr(0, 8), 16)).mod(this.prime);
  }
}

export default Client;
