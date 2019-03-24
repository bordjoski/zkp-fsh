import bigInt from 'big-integer';
import Utils from './utils';

class Agreement {
  /**
   * Agreement to be used between Client and Verifier
   * @param {*} p Prime
   * @param {*} g Generator
   */
  constructor(p, g) {
    this.prime = p;
    this.generator = g;
  }

  get bitLength() {
    return bigInt(this.prime).bitLength();
  }

  /**
   * Indicates if agreement is valid or not
   */
  get isValid() {
    return bigInt(this.prime).isProbablePrime();
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
