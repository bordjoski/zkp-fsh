/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */
import Agreement from './agreement';

/**
 * FSBase class is base class for Verifier and Client
 */
class FSBase {
  /**
   * @param {Agreement} agreement Agreement made between Client and Verifier
   */
  constructor(agreement) {
    if (!agreement) throw new Error('Initialization Error: Agreement is required');
    if (!agreement.prime || !agreement.generator) throw new Error('Invalid Agreement');
    if (!agreement.prime.isProbablePrime()) throw new Error('Invalid Agreement - Invalid prime number');
    if (agreement.bitLength < Agreement.MIN_LENGTH) {
      throw new Error(`Agreement must be initialized with at least ${Agreement.MIN_LENGTH}-bit prime`);
    }
    this.agreement = agreement;
  }
}

export default FSBase;
