import { assert } from 'chai';
import { Agreement } from '../src';

describe('Agreement test', () => {
  it('Should produce agreement with expected bit length', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      assert(agreement.bitLength === bitLength, `Unexpected agreement bit length ${agreement.bitLength}. Expected ${bitLength}`);
    });
  });
  it('Initialization of agreement from JSON should succeed with valid input', () => {
    const json = { prime: 101, generator: 2 };
    const agreement = Agreement.fromJSON(json);
    assert(agreement, 'Failed');
  });
  it('Initialization of agreement from JSON should fail with invalid input', () => {
    try {
      const agreement = Agreement.fromJSON({ p: 101, g: 2 });
      assert(agreement, 'Error expected');
    } catch (e) { }
  });
  it('Agreement should re-create from JSON', async () => {
    Agreement.generateAgreement(256).then((agreement) => {
      const json = agreement.toJSON();
      const agreement2 = Agreement.fromJSON(json)
      assert(agreement.prime.eq(agreement2.prime) && agreement.generator.eq(agreement2.generator), 'Invalid agreement bit length');
    });
  });
  it('Agreement should be invalid in the case prime bit length is lesser than 128bit', async () => {
    Agreement.generateAgreement(32).then((agreement) => {
      assert(!agreement.isValid, 'Expected to be invalid agreement');
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
