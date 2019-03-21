import { assert } from 'chai';

import { Client, Verifier, Utils } from '../src';

const clientPassword = 'password';
let registrationValue;
let signInValue;
let solvedChallange;
let client;
let verifier;
let prime;
let generator = 2;

const methods = ['md5', 'sha1', 'sha256', 'sha384', 'sha512'];
const pBits = [32, 64, 128, 256, 512, 1024, 2048];
methods.map(async m => {
  describe(`Library test ${m}`, () => {
    pBits.map(async p => {
      it(`${m} - ${p} test - Should generate valid prime`, async () => {
        prime = await Utils.getPrime(p);
        assert(prime, `${prime} invalid`);
      });

      it(`${m} - ${p} test - Should generate valid registration value`, () => {
        client = new Client(prime, generator);
        registrationValue = client.getRegistrationValue(clientPassword, m);
        assert(registrationValue, 'Registration value should not be NaN');
      });

      it(`${m} - ${p} test - Should generate valid signin value`, () => {
        signInValue = client.getSignInValue();
        assert(!isNaN(signInValue), 'Sign in value should not be NaN');
      });

      it(`${m} - ${p} test - Should solve a challange given by verifier`, () => {
        verifier = new Verifier(prime, generator);
        const challange = verifier.getChallange();
        solvedChallange = client.solveChallange(clientPassword, challange, m);
        assert(!isNaN(solvedChallange), 'Sign in value should not be NaN');
      });

      it(`${m} - ${p} test - Verifier should be able to verify in the case of right password`, () => {
        const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
        assert(success, 'Should succeed');
      });

      it(`${m} - ${p} test - Verification should fail in the case of wrong password`, async () => {
        const challange = await verifier.getChallange();
        solvedChallange = client.solveChallange('wrong-password', challange);
        const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
        assert(!success, 'Should fail');
      });
    })
  });
});