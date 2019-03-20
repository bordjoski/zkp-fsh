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
    prime = await Utils.getPrime();
    assert(prime, `${prime} invalid`);
  });

  it('Should generate valid registration value', () => {
    client = new Client(prime);
    verifier = new Verifier(prime);
    registrationValue = client.getRegistrationValue(clientPassword);
    console.log('registration value', registrationValue)
    assert(registrationValue, 'Registration value should not be NaN');
  });

  it('Should generate valid signin value', () => {
    signInValue = client.getSignInValue();
    console.log('Sign in value', signInValue);
    assert(!isNaN(signInValue), 'Sign in value should not be NaN');
  });

  it('Should solve a challange given by verifier', () => {
    const challange = verifier.getChallange();
    solvedChallange = client.solveChallange(clientPassword, challange);
    console.log('Challange:', verifier.getChallange());
    console.log('Solved challange', solvedChallange);
    assert(!isNaN(solvedChallange), 'Sign in value should not be NaN');
  });

  it('Verifier should be able to verify in the case of right password', () => {
    const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
    assert(success, 'Should succeed');
  });

  it('Verification should fail in the case of wrong password', async () => {
    const challange = await verifier.getChallange();
    solvedChallange = client.solveChallange('wrong-password', challange);
    const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
    assert(!success, 'Should fail');
  });
});

describe('Library test 2048', () => {
  it('Should generate large prime', async () => {
    prime = await Utils.getPrime(2048);
    assert(prime, `${prime} invalid`);
  });

  it('Should generate valid registration value', () => {
    client = new Client(prime, 7);
    verifier = new Verifier(prime, 7);
    registrationValue = client.getRegistrationValue(clientPassword);
    console.log('registration value', registrationValue);
    assert(registrationValue, 'Registration value should not be NaN');
  });

  it('Should generate valid signin value', () => {
    signInValue = client.getSignInValue();
    console.log('sign in value', signInValue);
    assert(!isNaN(signInValue), 'Sign in value should not be NaN');
  });

  it('Should solve a challange given by verifier', () => {
    solvedChallange = client.solveChallange(clientPassword, verifier.getChallange());
    console.log('Challange:', verifier.getChallange());
    console.log('Solved challange', solvedChallange);
    assert(!isNaN(solvedChallange), 'Sign in value should not be NaN');
  });

  it('Verifier should be able to verify in the case of right password', () => {
    const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
    assert(success, 'Should succeed');
  });

  it('Verification should fail in the case of wrong password', () => {
    solvedChallange = client.solveChallange('wrong-password', verifier.getChallange());
    const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
    assert(!success, 'Should fail');
  });
});