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
   * Default alphabet
   */
  static get DEFAULT_ALPHABET() {
    return '0123456789abcdefghijklmnopqrstuvwxyz';
  }

  /**
   * Default base / radix for agreement
   */
  static get DEFAULT_BASE() {
    return 10;
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
   * @param {Object} json Serialized agreement
   * @param {Config} config. Optional configuration parameter with specified based and alphabet
   */
  static fromJSON(json, config) {
    const {
      prime,
      generator,
      strength
    } = json;
    if (!prime || !generator) throw new Error('Invalid input');
    return new Agreement(prime, generator, strength, config || {});
  }

  /**
   * Agreement to be used between Client and Verifier
   * @param {String | Number} prime Prime number
   * @param {Number} generator Generator
   * @param {Number} strength Strength of Agreement. Allowed values are in range 1 - 2
   * @param {Object} config Optional configuration. Defines base (which defaults to 10)
   * and alphabet to be used during conversion process
   */
  constructor(prime, generator, strength, config = {}) {
    this.configure(config);
    try {
      this.prime = bigInt(prime, this.base, this.alphabet, true);
    } catch (e) {
      throw new Error('Invalid agreement configuration');
    }
    this.generator = bigInt(generator);
    this.strength = strength;
    if (this.strength < 1 || this.strength > Agreement.MAX_STRENGTH) {
      throw new Error('Invalid strength. Allowed values are in range 1 - 2');
    }
  }

  configure(config) {
    this.alphabet = config.alphabet || Agreement.DEFAULT_ALPHABET;
    this.base = config.base || Agreement.DEFAULT_BASE;
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
   * Serialize agreement
   */
  toJSON() {
    return {
      prime: this.prime.toString(this.base, this.alphabet),
      generator: this.generator.toString(),
      strength: this.strength
    };
  }
}

export default Agreement;
