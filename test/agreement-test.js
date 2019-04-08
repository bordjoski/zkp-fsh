import { assert } from 'chai';
import { Agreement } from '../src';

describe('Agreement test', () => {
  it('Should produce agreement with expected bit length', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      assert(agreement.bitLength === bitLength, `Unexpected agreement bit length ${agreement.bitLength}. Expected ${bitLength}`);
    });
  });

  it('Initialization of agreement from JSON should succeed with corectly formated input', () => {
    const json = { prime: 101, generator: 2, strength: 1 };
    const agreement = Agreement.fromJSON(json);
    assert(agreement, `Agreement should be correctly initialized with ${JSON.stringify(json)}`);
  });

  it('Initialization of agreement from JSON should fail with invalid input', () => {
    const json = { p: 101, g: 2 };
    let err;
    try {
      Agreement.fromJSON(json);
    } catch (e) {
      err = e;
    }
    assert(err, `Error expected with following input: ${JSON.stringify(json)}`);
  });

  it('Initialization of agreement should fail with invalid given strength', async () => {
    const aStrength = 6;
    let err;
    try {
      const a = await Agreement.generateAgreement(128, aStrength);
    } catch (e) {
      err = e;
    }
    assert(err, `Error expected with invalid given strength: ${aStrength}`);
  });

  it('Initialization of agreement from JSON should fail with invalid given strength', async () => {
    const a = await Agreement.generateAgreement(128, 2, 2);
    const json = a.toJSON();
    let err;
    try {
      json.strength = 6;
      Agreement.fromJSON(json);
    } catch (e) {
      err = e;
    }
    assert(err, 'Error expected with strength out of the range');
  });

  it('Agreement should re-create from JSON using same agreement configuration', async () => {
    const bits = 256;
    Agreement.generateAgreement(bits, 1.5, 2).then((agreement) => {
      const config = { base: 2, alphabet: '#%' };
      agreement.configure(config);
      const json = agreement.toJSON();
      const agreement2 = Agreement.fromJSON(json, config);
      assert(
        agreement2.isValid
        && agreement.prime.eq(agreement2.prime)
        && agreement.generator.eq(agreement2.generator)
        && agreement.strength === agreement2.strength,
        'Agreement should re-create from given values'
      );
    });
  });

  it('Agreement should fail to re-create from JSON using diferent agreement configuration', async () => {
    const bits = 256;
    Agreement.generateAgreement(bits, 1.5).then((agreement) => {
      const config1 = { base: 2, alphabet: '#%' };
      const config2 = { base: 10, alphabet: Agreement.DEFAULT_ALPHABET };
      agreement.configure(config1);
      const json = agreement.toJSON();
      let err;
      try {
        Agreement.fromJSON(json, config2);
      } catch (e) {
        err = e;
      }
      assert(err, 'Initialization of Agreement should fail with diferent config');
    });
  });

  it('Agreement should be invalid in the case prime bit length is lesser than 128bit', async () => {
    const bits = 32;
    Agreement.generateAgreement(bits).then((agreement) => {
      assert(!agreement.isValid, `Agreement expected to be invalid with ${bits}bit prime`);
    });
  });

  it('Agreement should be invalid in the case provided number is not prime number', async () => {
    Agreement.generateAgreement(128).then((agreement) => {
      assert(agreement.isValid, 'Expected to be valid');
      agreement.prime = agreement.prime.next();
      assert(!agreement.isValid, 'Expected to be invalid');
    });
  });

  it('Should throw error in the case "-" character is used in custom alphabet', async () => {
    Agreement.generateAgreement(128).then((agreement) => {
      let err;
      try {
        agreement.configure({ base: 2, alphabet: '-&' });
      } catch (e) {
        err = e;
      }
      assert(!agreement.isValid, 'Agreement should be invalid.');
      assert(err, 'Error expected');
    });
  });
});
