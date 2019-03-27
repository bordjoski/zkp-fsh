import { assert } from 'chai';
import bigInt from 'big-integer';
import { Agreement, Client, Verifier } from '../src';

describe('Client test', () => {
  it('Should succeed to set valid agreement', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client();
      let success;
      try {
        client.setAgreement(agreement);
        success = true;
      } catch (e) {
        success = false;
      }
      assert(success, `Expected to succeed with valid ${bitLength}bit agreement`);
    });
  });

  it('Should throw error when try to set agreement with bit length lesser than 128 bit', async () => {
    const bitLength = 64;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client();
      let error;
      try {
        client.setAgreement(agreement);
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
      const client = new Client();
      let error;
      try {
        client.setAgreement(agreement);
      } catch (e) {
        error = e;
      }
      assert(error, 'Expected to fail with non prime number');
    });
  });

  it('Should throw error during calculation of secret value where agreement is required but not provided previously', () => {
    const client = new Client();
    let error;
    try {
      client.getSecret('password');
    } catch (e) {
      error = e;
    }
    assert(error, 'Expected error');
  });

  it('Should throw error during calculation of claim where agreement is required but not provided previously', () => {
    const client = new Client();
    let error;
    try {
      client.getClaim();
    } catch (e) {
      error = e;
    }
    assert(error, 'Expected error');
  });

  it('Should throw error when try to get a proof but verification process was not initialized first', () => {
    const client = new Client();
    let error;
    try {
      client.getProof('proofRequest', 'password');
    } catch (e) {
      error = e;
    }
    assert(error, 'Expected error');
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
        Math.floor(proofToBig.bitLength() / agreement.bitLength) === Math.floor(8 * agreement.strength),
        `Invalid ${proofToBig.bitLength()}-bit proof`
      );
    });
  });
});
