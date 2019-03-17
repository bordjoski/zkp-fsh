import { assert } from 'chai';

import { Client, Verifier, Utils } from '../src';

const clientPassword = 'password';
let registrationValue;
let signInValue;
let solvedChallange;
let client;
let verifier;
let prime;

describe('Library test', () => {
  it('Should generate large prime', async () => {
    prime = await Utils.getPrime(1024);
    assert(prime, `${prime} invalid`);
  });

  it('Should generate valid registration value', () => {
    client = new Client(prime);
    verifier = new Verifier(prime);
    registrationValue = client.getRegistrationValue(clientPassword);
    assert(registrationValue, 'Registration value should not be NaN');
  });

  it('Should generate valid signin value', () => {
    signInValue = client.getSignInValue();
    assert(!isNaN(signInValue), 'Sign in value should not be NaN');
  });

  it('Should solve a challange given by verifier', () => {
    solvedChallange = client.solveChallange(clientPassword, verifier.random);
    assert(!isNaN(solvedChallange), 'Sign in value should not be NaN');
  });

  it('Verifier should be able to verify in the case of right password', () => {
    const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
    assert(success, 'Should succeed');
  });

  it('Verification should fail in the case of wrong password', () => {
    solvedChallange = client.solveChallange('wrong-password', verifier.random);
    const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
    assert(!success, 'Should fail');
  });
});
