import { assert } from 'chai';
import bigInt from 'big-integer';
import { Agreement, Verifier, Client } from '../src';

describe('Verifier test', () => {
  it('Should produce proof request with valid size', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const verifier = new Verifier(agreement);
      const proofReq = verifier.getProofRequest();
      const proofRequestToBig = bigInt(proofReq, agreement.base, agreement.alphabet, true);
      assert(
        Math.round((proofRequestToBig.bitLength() / agreement.bitLength) / (8 * agreement.strength)) === 1,
        `Invalid  ${proofRequestToBig.bitLength()}-bit proof request`
      );
    });
  });

  it('Should succeed to verify correctly solved challange', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      const verifier = new Verifier(agreement);
      const password = 'password';
      const secret = client.getSecret(password);
      const claim = client.getClaim();
      const proofReq = verifier.getProofRequest();
      const proof = client.getProof(proofReq, password);
      const success = verifier.verify(
        proof,
        claim,
        secret
      );
      assert(success, 'Should be able to verify');
    });
  });

  it('Should succeed to verify correctly solved challange with providing proofRequest in verify method', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      const verifier = new Verifier(agreement);
      const password = 'password';
      const secret = client.getSecret(password);
      const claim = client.getClaim();
      const proofReq = verifier.getProofRequest();
      const proof = client.getProof(proofReq, password);
      const success = verifier.verify(
        proof,
        claim,
        secret,
        proofReq
      );
      assert(success, 'Should be able to verify');
    });
  });

  it('Should fail to verify incorrectly solved challange', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      const verifier = new Verifier(agreement);
      const password = 'wrong-password';
      const secret = client.getSecret(password);
      const claim = client.getClaim();
      const proofReq = verifier.getProofRequest();
      const proof = client.getProof(proofReq, password);
      const success = verifier.verify(
        proof,
        claim,
        secret
      );
      assert(success, 'Should fail to verify');
    });
  });

  it('Should throw error in initialization phase where agreement is required but not provided', () => {
    let error;
    try {
      const verifier = new Verifier();
    } catch (e) {
      error = e;
    }
    assert(error, 'Expected error');
  });
});
