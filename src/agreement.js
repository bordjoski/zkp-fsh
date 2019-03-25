/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */
import bigInt from 'big-integer';
import Utils from './utils';

class Agreement {
  /**
   * Min bit length for prime
   */
  static get MIN_LENGTH() {
    return 128;
  }

  /**
   * Generate new agreement with given length
   * @param {Number} bits Length
   */
  static async generateAgreement(bits = 1024) {
    return new Promise((resolve, reject) => {
      Utils.generateAgreementValues(bits).then((a) => {
        resolve(new Agreement(a.prime, a.generator));
      }).catch((e) => {
        reject(e);
      });
    });
  }

  /**
   * Agreement to be used between Client and Verifier
   * @param {*} p Prime
   * @param {*} g Generator
   */
  constructor(p, g) {
    this.prime = bigInt(p);
    this.generator = bigInt(g);
  }

  /**
   * Prime bigLength
   */
  get bitLength() {
    return this.prime.bitLength().valueOf();
  }

  /**
   * Indicates if agreement is valid or not
   */
  get isValid() {
    return this.prime.isProbablePrime() && this.bitLength >= Agreement.MIN_LENGTH;
  }

  /**
   * Serialize to JSON
   */
  toJSON() {
    return {
      prime: this.prime.toString(),
      generator: this.generator.toString()
    };
  }

  /**
   * Deserialize an instance of type Agreement from JSON
   * @param {Object} value
   */
  static fromJSON(value) {
    if (!value.prime || !value.generator) throw new Error('Invalid input');
    return new Agreement(value.prime, value.generator);
  }
}

export default Agreement;
