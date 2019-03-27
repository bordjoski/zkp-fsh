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

  it('Initialization of agreement from JSON should fail with invalid given strength', () => {
    const json = { prime: 101, generator: 2, strength: 4 };
    let err;
    try {
      Agreement.fromJSON(json);
    } catch (e) {
      err = e;
    }
    assert(err, 'Error expected with strength out of the range');
  });

  it('Agreement should re-create from JSON', async () => {
    const bits = 256;
    Agreement.generateAgreement(bits, 1.5).then((agreement) => {
      const json = agreement.toJSON();
      const agreement2 = Agreement.fromJSON(json)
      assert(
        agreement.prime.eq(agreement2.prime)
        && agreement.generator.eq(agreement2.generator)
        && agreement.strength === agreement2.strength,
        'Agreement should re-create from given values'
      );
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
      agreement.prime = agreement.prime.minus(1);
      assert(!agreement.isValid, 'Expected to be invalid');
    });
  });
});
