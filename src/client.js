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
    const md = forge.md.sha384.create();
    md.update(Buffer.from(password).toString('base64'));
    return bigInt(parseInt(md.digest().toHex().substr(0, 8), 16))
      .mod(this.prime);
  }
}

export default Client;
