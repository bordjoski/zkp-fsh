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
   * @param {Object} value
   * @param base Base. Optional base parameter (which defaults to 10).
   * @param alphabet Alphabet to be used
   */
  static fromJSON(json, base, alphabet) {
    const {
      prime,
      generator,
      strength
    } = json;
    if (!prime || !generator) throw new Error('Invalid input');
    return new Agreement(prime, generator, strength, base, alphabet);
  }

  /**
   * Agreement to be used between Client and Verifier
   * @param {String | Number} prime Prime number
   * @param {Number} generator Generator
   * @param {Number} strength Strength of Agreement. Allowed values are in range 1 - 2
   * @param {Number} base Optional base/radix parameter (which defaults to 10)
   * @param {alphabet} alphabet Alphabet to be used during conversion process
   */
  constructor(prime, generator, strength, base, alphabet) {
    this.configure(base, alphabet);
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

  configure(base, alphabet) {
    this.alphabet = alphabet || Agreement.DEFAULT_ALPHABET;
    this.base = base || Agreement.DEFAULT_BASE;
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
