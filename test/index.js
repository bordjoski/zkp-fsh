import { assert } from 'chai';
import bigInt from 'big-integer';
import { Client, Verifier, Utils } from '../src';


const generator = 2;
let registrationValue;
let signInValue;
let solvedChallange;
let client;
let verifier;
let prime;
let challange;
let password;

const algs = ['md5', 'sha1', 'sha256', 'sha384', 'sha512'];
const pBits = [128, 256, 512, 1024, 2048];
const pModes = [
  {
    power: false,
    expectedComparation: 8
  },
  {
    power: true,
    expectedComparation: 12
  }];

algs.map(async (a) => {
  pModes.map(async (pMode) => {
    describe(`${a} - Library test with power ${pMode.power ? 'on' : 'off'}`, () => {
      pBits.map(async (p) => {
        it(`${a} - ${p} test - Should be able to generate valid prime`, async () => {
          prime = await Utils.getPrime(p);
          assert(bigInt(prime.toString()).isProbablePrime(), 'Invalid prime');
        });

        it(`${a} - ${p} test - Client should be able generate valid registration value`, () => {
          client = new Client(prime, generator, pMode.power);
          password = `password${(Math.random() * 100000).toString()}`;
          registrationValue = client.getRegistrationValue(password, a);
          assert(
            Math.round(bigInt(prime.toString()).bitLength() / registrationValue.bitLength()) === 1,
            `Unecpected registration value with ${registrationValue.bitLength()} lentgh`
          );
        });

        it(`${a} - ${p} test - Client should be able generate valid signin value`, () => {
          signInValue = client.getSignInValue();
          assert(
            Math.round(bigInt(prime.toString()).bitLength() / signInValue.bitLength()) === 1,
            `Unecpected sign in value with ${signInValue.bitLength()} lentgh`
          );
        });

        it(`${a} - ${p} test - Verifier should be able generate valid challange`, () => {
          verifier = new Verifier(prime, generator, pMode.power);
          challange = verifier.getChallange();
          assert(
            Math.round(challange.bitLength() / bigInt(prime.toString()).bitLength()) === pMode.expectedComparation,
            `Invalid challange with ${challange.bitLength()} length`
          );
        });

        it(`${a} - ${p} test - Client should be able to solve a challange given by verifier`, () => {
          solvedChallange = client.solveChallange(password, challange, a);
          assert(
            Math.floor(solvedChallange.bitLength() / bigInt(prime.toString()).bitLength()) === pMode.expectedComparation,
            `Invalid solved value with ${solvedChallange.bitLength()} length`
          );
        });

        it(`${a} - ${p} test - Verifier should be able to verify in the case of right password`, () => {
          const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
          assert(success, 'Failed');
        });

        it(`${a} - ${p} test - Verification should fail in the case of wrong password`, async () => {
          solvedChallange = client.solveChallange('wrong-password', challange);
          const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
          assert(!success, 'Failed');
        });
      });
    });
  });
});
