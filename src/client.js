/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import bigInt from 'big-integer';
import FSBase from './fsbase';
import Utils from './utils';

/**
 * Client class represents subject of verification.
 * Client should never share verification process identifier or a password
 */
class Client extends FSBase {
  /**
   * Acceptable message digest algorithms
   */
  static get ACCEPTABLE_ALGORITHMS() {
    return {
      md5: 'md5',
      sha1: 'sha1',
      sha256: 'sha256',
      sha384: 'sha384',
      sha512: 'sha512'
    };
  }

  /**
   * Get secret for registration purposes
   * @param {String} password Password
   * @param {String} algorithm message-digest algorithm
   */
  getSecret(password, algorithm = 'md5') {
    if (!this.agreement) throw new Error('Agreement is required');
    if (!Client.ACCEPTABLE_ALGORITHMS[algorithm]) {
      const supported = Object.keys(Client.ACCEPTABLE_ALGORITHMS).toString();
      throw new Error(`Unsuported algorithm ${algorithm}. Supported message digest algorithms are: ${supported}`);
    }
    const hMod = Utils.fromPassword(password, algorithm).mod(this.agreement.prime);
    const secret = this.agreement.generator.modPow(hMod, this.agreement.prime);
    return secret.toString(this.agreement.base, this.agreement.alphabet);
  }

  /**
   * Get claim
   */
  getClaim() {
    if (!this.agreement) throw new Error('Agreement is required');
    this.authProcessId = Utils.generateAuthProcessId(this.agreement);
    const claim = this.agreement.generator.modPow(
      this.authProcessId,
      this.agreement.prime
    );
    return claim.toString(this.agreement.base, this.agreement.alphabet);
  }

  /**
   * Get proof
   * @param {*} proofRequest Proof request given by Verifier
   * @param {String} password Password
   * @param {String} algorithm message-digest algorithm
   */
  getProof(proofRequest, password, algorithm = 'md5') {
    if (!this.authProcessId) throw new Error('Authentication process not initialized');
    const x = Utils.fromPassword(password, algorithm).mod(this.agreement.prime);
    const proofReq = bigInt(proofRequest, this.agreement.base, this.agreement.alphabet, true);
    const proof = this.authProcessId.minus(proofReq.multiply(x));
    return proof.toString(this.agreement.base, this.agreement.alphabet);
  }
}

export default Client;
