/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import bigInt from 'big-integer';
import math from 'mathjs';
import FSBase from './fsbase';

/**
 * Verifier class exposes a method enabling verifier to verify solved challange
 */
class Verifier extends FSBase {
  /**
   * Verifies result provided by initiator of sign in process.
   * @param {Number} challangeResult Solved challange value
   * @param {Number} registrationValue Value used in registration process
   * @param {Number} signInValue Value provided by initiator in sign in process
   */
  verifyChallange(challangeResult, registrationValue, signInValue) {
    // (g**challangeResult) * (registrationValue**valueOfVerifier) = signInValue

    // (registrationValue**valueOfVerifier)
    const n = bigInt(registrationValue).modPow(this.random, this.prime);

    // (g**challangeResult)
    const m = (challangeResult < 0)
      ? this.inverseOf(bigInt(this.generator)
        .modPow(-challangeResult, this.prime).valueOf(), this.prime)
      : bigInt(this.generator)
        .modPow(challangeResult, this.prime).valueOf();

    const r = bigInt(m * n).mod(this.prime).valueOf();

    return signInValue === r;
  }

  /**
   * If challange result is negative number, compute the inverse mod of it -
   * determinated by extended euclidean algorithm
   * @param {Number} n g**-challangeResult % p
   * @param {Number} p Prime number
   * @private
   */
  // eslint-disable-next-line class-methods-use-this
  inverseOf(n, p) {
    const r = math.xgcd(n, p);
    // In case r._data[1] is negative, add extra p
    // since multiplicative inverse of A in range p lies in the range [0, p-1]
    // eslint-disable-next-line no-underscore-dangle
    const x = r._data[1] < 0 ? r._data[1] + p : r._data[1];
    return bigInt(x).mod(p).valueOf();
  }
}

export default Verifier;
