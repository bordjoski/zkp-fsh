/* eslint-disable no-underscore-dangle */
/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import bigInt from 'big-integer';
import FSBase from './fsbase';
import Utils from './utils';

/**
 * Verifier class represents a verifier.
 * Exposes public methods for generating proof request and verification of the proof.
 */
class Verifier extends FSBase {
  /**
   * @param {Agreement} agreement Agreement made between Client and Verifier
   * @param {*} authenticationProcessId Optional. Proof request given to the Client
   */
  constructor(agreement, authenticationProcessId) {
    super(agreement);
    if (authenticationProcessId) {
      this.authProcessId = bigInt(authenticationProcessId);
    }
  }

  /**
   * Generates proof request for the Client.
   */
  getProofRequest() {
    if (!this.agreement) throw new Error('Agreement is required');
    this.authProcessId = Utils.generateAuthProcessId(this.agreement);
    return this.authProcessId;
  }

  /**
   * Verifies the proof provided by Client
   * @param {*} proof Proof provided by Client
   * @param {*} claim Claim provided by Client
   * @param {*} secret Secret provided by Client
   */
  verify(proof, claim, secret) {
    this.setProof(proof);
    if (claim) this.setClaim(claim);
    if (secret) this.setSecret(secret);

    if (!this.agreement) throw new Error('Verification Error: Agreement is required');
    if (!this.authProcessId) throw new Error('Verification Error: Authentication process not initialized');
    if (!this.secret) throw new Error('Verification Error: Missing the secret');
    if (!this.claim) throw new Error('Verification Error: Missing the claim');

    const n = this.secret.modPow(this.authProcessId, this.agreement.prime);
    const m = this.proof.isNegative()
      ? Utils.inverseOf(
        this.agreement.generator.modPow(this.proof.times(bigInt(-1)), this.agreement.prime),
        this.agreement.prime
      )
      : this.agreement.generator.modPow(this.proof, this.agreement.prime);
    const mn = m.times(n);
    const verificationResult = mn.mod(this.agreement.prime);
    return this.claim.eq(verificationResult);
  }

  /**
   * Set claim
   * @param {*} claim Claim provided by Client
   */
  setClaim(claim) {
    this.claim = bigInt(claim);
  }

  /**
   * Set proof
   * @param {} proof Proof provided by Client.
   */
  setProof(proof) {
    this.proof = bigInt(proof);
  }

  /**
   * Set secret
   * @param {*} secret Secret provided by Client
   */
  setSecret(secret) {
    this.secret = bigInt(secret);
  }
}

export default Verifier;
