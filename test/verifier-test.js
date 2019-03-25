import { assert } from 'chai';
import { Agreement, Verifier, Client } from '../src';

describe('Verifier test', () => {
  it('Should produce valid challange', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const verifier = new Verifier(agreement);
      const challange = verifier.getChallange();
      assert(
        Math.round(challange.bitLength() / agreement.bitLength) === 8,
        `Invalid challange with ${challange.bitLength()} length`
      );
    });
  });
  it('Should verify correctly solved challange', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      const verifier = new Verifier(agreement);
      const password = 'password';

      const regVal = client.getRegistration(password);
      const sigVal = client.getSignIn();
      const challange = verifier.getChallange();
      const solved = client.solveChallange(password, challange);
      const success = verifier.verify(
        solved,
        regVal,
        sigVal
      );
      assert(success, 'Should be able to verify');
    });
  });
  it('Should fail to verify incorrectly solved challange', async () => {
    const bitLength = 256;
    Agreement.generateAgreement(bitLength).then((agreement) => {
      const client = new Client(agreement);
      const verifier = new Verifier(agreement);
      const password = 'password';

      const regVal = client.getRegistration(password);
      const sigVal = client.getSignIn();
      const challange = verifier.getChallange();
      const solved = client.solveChallange('invalid-pass', challange);
      const success = verifier.verify(
        solved,
        regVal,
        sigVal
      );
      assert(!success, 'Should fail to verify');
    });
  });
  it('Should throw error when try to verify but no agreement is provided previously', () => {
    const verifier = new Verifier();
    let err;
    try {
      verifier.verify('solved', 'reg', 'sign');
    } catch (e) {
      err = e;
    }
    assert(err, 'Error expected');
  });
  it('Should throw error when try to get a challange but no agreement is provided previously', () => {
    const verifier = new Verifier();
    let err;
    try {
      verifier.getChallange();
    } catch (e) {
      err = e;
    }
    assert(err, 'Error expected');
  });
});
