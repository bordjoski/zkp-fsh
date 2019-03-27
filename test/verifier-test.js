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
        Math.round(proofRequestToBig.bitLength() / agreement.bitLength) === Math.floor(8 * agreement.strength),
        `Invalid  ${proofRequestToBig.bitLength()}-bit proof request`
      );
    });
  });

  it('Should verify correctly solved challange', async () => {
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

  it('Should throw error when try to verify proof but no agreement is provided previously', () => {
    const verifier = new Verifier();
    let err;
    try {
      verifier.verify('claim', 'proof', 'secret');
    } catch (e) {
      err = e;
    }
    assert(err, 'Error expected');
  });

  it('Should throw error when try to get a proof request but no agreement is provided previously', () => {
    const verifier = new Verifier();
    let err;
    try {
      verifier.getProofRequest();
    } catch (e) {
      err = e;
    }
    assert(err, 'Error expected');
  });
});
