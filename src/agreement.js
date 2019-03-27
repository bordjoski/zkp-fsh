/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */
import bigInt from 'big-integer';
import Utils from './utils';

class Agreement {
  /**
   * Minimum bit length of prime number
   */
  static get MIN_LENGTH() {
    return 128;
  }

  /**
   * Max strength of agreement
   */
  static get MAX_STRENGTH() {
    return 2;
  }

  /**
   * Generate new agreement
   * @param {Number} bits bit length of prime number used in agreement
   * @param {Number} strength Strength of agreement. Allowed values are in range 1 - 2
   */
  static async generateAgreement(bits = 1024, strength = 1) {
    return new Promise((resolve, reject) => {
      Utils.generateAgreementValues(bits).then((a) => {
        resolve(new Agreement(a.prime, a.generator, strength));
      }).catch((e) => {
        reject(e);
      });
    });
  }

  /**
   * Deserialize an instance of type Agreement from JSON
   * @param {Object} value
   */
  static fromJSON(value) {
    const {
      prime,
      generator,
      strength
    } = value;
    if (!prime || !generator) throw new Error('Invalid input');
    return new Agreement(prime, generator, strength || 1);
  }

  /**
   * Agreement to be used between Client and Verifier
   * @param {*} prime Prime number
   * @param {*} generator Generator
   * @param {Number} strength Strength of Agreement. Allowed values are in range 1 - 2
   */
  constructor(prime, generator, strength = 1) {
    if (strength < 1 || strength > Agreement.MAX_STRENGTH) {
      throw new Error('Invalid strength. Allowed values are in range 1 - 2');
    }
    this.prime = bigInt(prime);
    this.generator = bigInt(generator);
    this.strength = strength;
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
      generator: this.generator.toString(),
      strength: this.strength
    };
  }
}

export default Agreement;
