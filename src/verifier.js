/* eslint-disable no-underscore-dangle */
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
   * @param {Number} c Solved challange value
   * @param {Number} r Value used in registration process
   * @param {Number} s Value provided by initiator in sign in process
   * @param {Number} q Challange given to the Client
   */
  verifyChallange(c, r, s, q) {
    if (q) this.setRandom(q);
    const bc = bigInt(c);
    const n = bigInt(r).modPow(this.random, this.prime);
    const m = bc.isNegative()
      ? this.inverseOf(
        this.generator.modPow(bc.times(bigInt(-1)), this.prime),
        this.prime
      )
      : this.generator.modPow(bc, this.prime);

    const mn = m.times(n);
    const v = mn.mod(this.prime);
    return bigInt(s).eq(v);
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
    math.config({
      number: 'BigNumber',
      precision: Math.floor(this.prime.bitLength() * 0.33)
    });

    const r = math.xgcd(
      math.bignumber(n.toString()),
      math.bignumber(p.toString())
    );

    const x = bigInt(r._data[1].toString());
    // In case r._data[1] is negative, add extra p
    // since multiplicative inverse of A in range p lies in the range [0, p-1]
    const xp = x.isNegative() ? x.plus(p) : x;
    return xp.mod(p);
  }

  /**
   * Get a challange for client.
   */
  getChallange() {
    this.random = this.generateRandom();
    return this.random;
  }
}

export default Verifier;
