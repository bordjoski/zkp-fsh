/* eslint-disable no-underscore-dangle */
/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import bigInt from 'big-integer';
import math from 'mathjs';
import FSBase from './fsbase';
import Utils from './utils';

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

    const bigChallangeResult = bigInt(challangeResult);
    // (registrationValue**valueOfVerifier)
    const n = bigInt(registrationValue).modPow(this.random, this.prime);

    // (g**challangeResult)
    const m = bigChallangeResult.isNegative()
      ? this.inverseOf(
        this.generator.modPow(bigChallangeResult.times(bigInt(-1)), this.prime),
        this.prime
      )
      : this.generator.modPow(bigChallangeResult, this.prime);

    const mn = m.times(n);
    const r = mn.mod(this.prime);
    return bigInt(signInValue).eq(r);
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
    const r = math.xgcd(
      math.bignumber(n.toString()),
      math.bignumber(p.toString())
    );
    const x = bigInt(r._data[1].toString());
    // In case r._data[1] is negative, add extra p
    // since multiplicative inverse of A in range p lies in the range [0, p-1]
    const xp = x.isNegative()
      ? x.plus(p)
      : x;

    return xp.mod(p);
  }

  /**
   * @override
   */
  // eslint-disable-next-line class-methods-use-this
  generateRandom() {
    const bits = this.prime.bitLength();
    return Utils.getRandomSync(Math.floor(bits * 0.9));
  }

  /**
   * Get a challange for client.
   */
  getChallange() {
    return this.random;
  }
}

export default Verifier;
