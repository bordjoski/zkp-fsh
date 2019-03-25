/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import Utils from './utils';
import Agreement from './agreement';

/**
 * FSBase class is base class for Verifier and Client
 */
class FSBase {
  /**
   * Acceptable message digest
   */
  static get ACCEPTABLE_DIGEST() {
    return {
      md5: true,
      sha1: true,
      sha256: true,
      sha384: true,
      sha512: true
    };
  }

  /**
   * Affects random bit length
   */
  static get MAX_POWER() { return 1.5; }

  /**
   * @param {Agreement} agreement Agreement made between Client and Verifier
   * @param {Boolean} power If true, produces larger randoms.
   * Affects challange size or solved challange size and verification speed
   */
  constructor(agreement, power = false) {
    if (agreement) this.setAgreement(agreement);
    this.power = power;
  }

  /**
   * Set agreement to be used
   * @param {Agreement} agreement Agreement containing prime and g
   */
  setAgreement(agreement) {
    if (!agreement.prime || !agreement.generator) throw new Error('Invalid agreement');
    if (!agreement.prime.isProbablePrime()) {
      throw new Error('Invalid prime');
    }
    if (agreement.bitLength < Agreement.MIN_LENGTH) {
      throw new Error(`Agreement must be initialized with at least ${Agreement.MIN_LENGTH}bit prime`);
    }
    this.agreement = agreement;
  }

  /**
   * Generate random number to be used
   * @private
   */
  generateRandom() {
    if (!this.agreement) throw new Error('Agreement is required');
    const bits = this.power
      ? Math.floor(this.agreement.bitLength * FSBase.MAX_POWER)
      : this.agreement.bitLength;
    return Utils.getRandomSync(bits);
  }
}

export default FSBase;
