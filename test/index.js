import { assert } from 'chai';

import { Client, Verifier, Utils } from '../src';

const prime = Utils.getPrime(100000, 1000000);
const generator = Utils.getGenerator(prime);

const client = new Client(prime, generator);
const verifier = new Verifier(prime, generator);

const clientPassword = 'password';

let registrationValue;
let signInValue;
let solvedChallange;

describe('Library test', () => {
  it('Agreed number should be prime number', () => {
    assert(Utils.isPrime(prime), `${prime} is not prime number`);
  });

  it('Initiator calculates registration value and passes it to verifier.', () => {
    registrationValue = client.getRegistrationValue(clientPassword);
    assert(!isNaN(registrationValue), 'Registration value should not be NaN');
  });

  it('Initiator initiate sign in process and calculates sign in value and passes it to verifier.', () => {
    signInValue = client.getSignInValue();
    assert(!isNaN(signInValue), 'Sign in value should not be NaN');
  });

  it('Client should solve a challange with random number given by verifier and verifier should verify provided answer is correct', () => {
    solvedChallange = client.solveChallange(clientPassword, verifier.random);
    const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
    assert(success, 'Should succeed');
  });

  it('Verificaton of solved challange should fail in the case of wrong password', () => {
    solvedChallange = client.solveChallange('wrong-password', verifier.random);
    const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
    assert(!success, 'Should succeed');
  });
});
