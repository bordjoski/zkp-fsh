/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import bigInt from 'big-integer';
import FSBase from './fsbase';
import Utils from './utils';

/**
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
  getRegistration(password, md = 'md5') {
    if (!this.agreement) throw new Error('Agreement is required');
    const x = this.calculateSecret(password, md);
    return this.agreement.generator.modPow(x, this.agreement.prime);
  }

  /**
   * Get value for initialization of verification process.
   */
  getSignIn() {
    this.random = this.generateRandom();
    return this.agreement.generator.modPow(this.random, this.agreement.prime);
  }

  /**
   * Solves a challange given by verifier - gets a proof.
   * @param {String} password Choosen password
   * @param {*} challange Random number given by verifier
   */
  solveChallange(password, challange, md = 'md5') {
    if (!this.random) throw new Error('Verification process not initialized');
    const x = this.calculateSecret(password, md);
    return this.random.minus(bigInt(challange).multiply(x));
  }

  /**
   * Calculate the secret based on password and prime number.
   * @param {String} password Choosen password
   * @private
   */
  calculateSecret(password, md) {
    if (!FSBase.ACCEPTABLE_DIGEST[md]) {
      const supported = Object.keys(FSBase.ACCEPTABLE_DIGEST).toString();
      throw new Error(`Unsuported ${md}. Supported message digest are: ${supported}`);
    }
    return Utils.fromPassword(password, md).mod(this.agreement.prime);
  }
}

export default Client;
