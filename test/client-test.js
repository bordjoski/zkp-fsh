import { assert } from 'chai';
import bigInt from 'big-integer';
import { Agreement, Client, Verifier } from '../src';

describe('Client test', () => {
  it('Should succeed to set valid agreement', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      let err;
      try {
        client = new Client(agreement);
      } catch (e) {
        err = e;
      }
      assert(err, `Expected to succeed with valid ${bitLength}-bit agreement`);
    });
  });

  it('Should throw error when try to set agreement with bit length lesser than 128 bit', async () => {
    const bitLength = 64;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      let error;
      try {
        const client = new Client(agreement);
      } catch (e) {
        error = e;
      }
      assert(error, `Expected to fail with invalid bit length of ${bitLength} bits`);
    });
  });

  it('Should throw error when try to set agreement with non prime number', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      agreement.prime = agreement.prime.minus(1);
      let error;
      try {
        const client = new Client(agreement);
      } catch (e) {
        error = e;
      }
      assert(error, 'Expected to fail with non prime number');
    });
  });

  it('Should throw error in initialization phase where agreement is required but not provided', () => {
    let error;
    try {
      const client = new Client();
    } catch (e) {
      error = e;
    }
    assert(error, 'Expected error');
  });

  it('Should throw error when try to get a proof but verification process was not initialized first', async () => {
    const bitLength = 128;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      let error;
      try {
        client.getProof('proofRequest', 'password');
      } catch (e) {
        error = e;
      }
      assert(error, 'Expected error');
    });
  });

  it('Should calculate secret with valid size in the case of valid agreement', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      const secret = client.getSecret('password');
      const secretToBig = bigInt(secret, agreement.base, agreement.alphabet, true);
      assert(
        Math.round(agreement.bitLength / secretToBig.bitLength()) === 1,
        `Unecpected ${secretToBig.bitLength()}-bit secret`
      );
    });
  });

  it('Should calculate claim with valid size in the case of valid agreement', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      const claim = client.getClaim();
      const claimToBig = bigInt(claim, agreement.base, agreement.alphabet, true);
      assert(
        Math.round(agreement.bitLength / claimToBig.bitLength()) === 1,
        `Unecpected ${claimToBig.bitLength()}-bit claim`
      );
    });
  });

  it('Should be able to produce proof with valid size', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      const verifier = new Verifier(agreement);
      const claim = client.getClaim();
      const proofRequest = verifier.getProofRequest();
      const proof = client.getProof(proofRequest, 'password');
      const proofToBig = bigInt(proof, agreement.base, agreement.alphabet, true);
      assert(
        Math.round((proofToBig.bitLength() / agreement.bitLength) / (8 * agreement.strength)) === 1,
        `Invalid ${proofToBig.bitLength()}-bit proof`
      );
    });
  });

  it('Should throw the error when calculating secret in the case of unsupported algorithm', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      const alg = 'sha512/224';
      let err;
      try {
        const secret = client.getSecret('password', alg)
      } catch (e) {
        err = e;
      }
      assert(err, `Error expected with ${alg}`);
    });
  });

  it('Should throw the error when calculating proof in the case of unsupported algorithm', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      const alg = 'sha512/256';
      let err;
      try {
        const proof = client.getProof('1', 'password', alg);
      } catch (e) {
        err = e;
      }
      assert(err, `Error expected with ${alg}`);
    });
  });
});
