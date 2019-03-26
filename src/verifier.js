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
   * @param {*} verificationProcessId Optional. Proof request given to the Client
   */
  constructor(agreement, verificationProcessId) {
    super(agreement);
    if (verificationProcessId) {
      this.verificationProcessId = bigInt(verificationProcessId);
    }
  }

  /**
   * Generates proof request for the Client.
   */
  getProofRequest() {
    if (!this.agreement) throw new Error('Agreement is required');
    this.verificationProcessId = Utils.generateVerificationProcessId(this.agreement);
    return this.verificationProcessId;
  }

  /**
   * Verifies the proof provided by Client
   * @param {*} claim Claim provided by Client
   * @param {*} proof Proof provided by Client
   * @param {*} secret Secret provided by Client
   */
  verify(claim, proof, secret) {
    if (!this.agreement) throw new Error('Agreement is required');
    if (!this.verificationProcessId) throw new Error('Verification process not initialized');

    this.setClaim(claim);
    this.setProof(proof);
    this.setSecret(secret);

    const n = this.secret.modPow(this.verificationProcessId, this.agreement.prime);
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
