import bigInt from 'big-integer';
import Utils from './utils';

class Agreement {
  static get MIN_LENGTH() {
    return 128;
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

  get bitLength() {
    return this.prime.bitLength();
  }

  /**
   * Indicates if agreement is valid or not
   */
  get isValid() {
    return this.prime.isProbablePrime() && this.bitLength >= Agreement.MIN_LENGTH;
  }

  toJSON() {
    return {
      prime: this.prime.toString(),
      generator: this.generator.toString()
    };
  }

  static fromJSON(value) {
    return new Agreement(value.prime, value.generator);
  }

  /**
   * Generate new agreement with given length
   * @param {Number} bits Length
   */
  static async generateAgreement(bits = 1024) {
    return new Promise((resolve, reject) => {
      Utils.generateAgreement(bits).then((a) => {
        resolve(new Agreement(a.prime, a.generator));
      }).catch((e) => {
        reject(e);
      });
    });
  }
}

export default Agreement;
