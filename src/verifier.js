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
   * Generates proof request for the Client.
   */
  getProofRequest() {
    if (!this.agreement) throw new Error('Agreement is required');
    this.authProcessId = Utils.generateAuthProcessId(this.agreement);
    return this.authProcessId.toString(this.agreement.base, this.agreement.alphabet);
  }

  /**
   * Verifies the proof provided by Client
   * @param {String} proof Proof provided by Client
   * @param {String} claim Claim provided by Client
   * @param {String} secret Secret provided by Client
   * @param {String} proofRequest Optional. Proof request given to the Client.
   * Useful in the case Verifier is initialized for verification only.
   */
  verify(proof, claim, secret, proofRequest) {
    if (!this.agreement) throw new Error('Verification Error: Agreement is required');

    this.setProof(proof);
    if (claim) this.setClaim(claim);
    if (secret) this.setSecret(secret);
    if (proofRequest) {
      this.authProcessId = bigInt(
        proofRequest,
        this.agreement.base,
        this.agreement.alphabet,
        true
      );
    }

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
    this.claim = bigInt(claim, this.agreement.base, this.agreement.alphabet, true);
  }

  /**
   * Set proof
   * @param {} proof Proof provided by Client.
   */
  setProof(proof) {
    this.proof = bigInt(proof, this.agreement.base, this.agreement.alphabet, true);
  }

  /**
   * Set secret
   * @param {*} secret Secret provided by Client
   */
  setSecret(secret) {
    this.secret = bigInt(secret, this.agreement.base, this.agreement.alphabet, true);
  }
}

export default Verifier;
