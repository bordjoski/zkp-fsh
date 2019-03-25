import { assert } from 'chai';
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
      assert(success, 'Expected to succeed with valid agreement');
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
      assert(error, 'Expected to fail with invalid bit length size');
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
  it('Should throw error during calculation of registration value where agreement is required but not provided previously', () => {
    const client = new Client();
    let error;
    try {
      client.getRegistration('password');
    } catch (e) {
      error = e;
    }
    assert(error, 'Expected error');
  });
  it('Should throw error during calculation of sign in value where agreement is required but not provided previously', () => {
    const client = new Client();
    let error;
    try {
      client.getSignIn();
    } catch (e) {
      error = e;
    }
    assert(error, 'Expected error');
  });
  it('Should throw error when try to solve a challange but sign in process was not initialized first', () => {
    const client = new Client();
    let error;
    try {
      client.solveChallange('password', 'c');
    } catch (e) {
      error = e;
    }
    assert(error, 'Expected error');
  });
  it('Should calculate valid registration value in the case of valid agreement', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      const regVal = client.getRegistration('password');
      assert(
        Math.round(agreement.bitLength / regVal.bitLength()) === 1,
        `Unecpected registration value with ${regVal.bitLength()} lentgh`
      );
    });
  });
  it('Should calculate valid signin value in the case of valid agreement', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      const sigVal = client.getSignIn();
      assert(
        Math.round(agreement.bitLength / sigVal.bitLength()) === 1,
        `Unecpected signin value with ${sigVal.bitLength()} lentgh`
      );
    });
  });
  it('Should be able to produce valid challange response', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      const verifier = new Verifier(agreement);
      const sigVal = client.getSignIn();
      const challange = verifier.getChallange();
      const proof = client.solveChallange('password', challange);
      assert(
        Math.floor(proof.bitLength() / agreement.bitLength) === 8,
        `Invalid solved value with ${proof.bitLength()} length`
      );
    });
  });
});
