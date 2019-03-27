import { assert } from 'chai';
import bigInt from 'big-integer';
import { Client, Verifier, Agreement } from '../src';

let secret;
let claim;
let proof;
let client;
let verifier;
let proofRequest;
let password = "password";
let agreement;

const algs = ['md5', 'sha1', 'sha256', 'sha384', 'sha512'];
const pBits = [128, 256, 512, 1024, 2048];

// testing with following agreement strengths:
const strengths = [1, 1.4, 2];

pBits.map(async (p) => {
  strengths.map(async (strength) => {
    describe(`${p}-bit agreement test with strength ${strength}`, () => {
      it(`${p}-bit - Should be able to generate valid agreement with given bit length`, async () => {
        agreement = await Agreement.generateAgreement(p, strength);
        agreement.configure(10, Agreement.DEFAULT_ALPHABET);
        assert(agreement.isValid, 'Invalid agreement');
        assert(agreement.bitLength === p, `Invalid prime size ${agreement.bitLength}. Expected ${p}`);
      });
      algs.map(async (algorithm) => {
        it(`${p}-bit - ${algorithm} - strength: ${strength} - Client should be able generate secret with valid length`, () => {
          client = new Client(agreement);
          secret = client.getSecret(password, algorithm);
          const secretToBig = bigInt(secret, agreement.base, agreement.alphabet, true);
          assert(
            Math.round(agreement.bitLength / secretToBig.bitLength()) === 1,
            `Unecpected ${secretToBig.bitLength()}-bit secret`
          );
        });

        it(`${p}-bit - ${algorithm} - strength: ${strength} - Client should be able generate claim with valid size`, () => {
          claim = client.getClaim();
          const claimToBig = bigInt(claim, agreement.base, agreement.alphabet, true);
          assert(
            Math.round(agreement.bitLength / claimToBig.bitLength()) === 1,
            `Unecpected ${claimToBig.bitLength()}-bit claim`
          );
        });

        it(`${p}-bit - ${algorithm} - strength: ${strength} - Verifier should be able generate proof request with valid size`, () => {
          verifier = new Verifier(agreement);
          proofRequest = verifier.getProofRequest();
          const proofRequestToBig = bigInt(proofRequest, agreement.base, agreement.alphabet, true);
          assert(
            Math.round(proofRequestToBig.bitLength() / agreement.bitLength) === Math.round(8 * agreement.strength),
            `Invalid ${proofRequestToBig.bitLength()}-bit proof request`
          );
        });

        it(`${p}-bit - ${algorithm} - strength: ${strength} - Client should be able to produce proof with valid size`, () => {
          proof = client.getProof(proofRequest, password, algorithm);
          const proofToBig = bigInt(proof, agreement.base, agreement.alphabet, true);
          assert(
            Math.round(proofToBig.bitLength() / agreement.bitLength) === Math.round(8 * agreement.strength),
            `Invalid ${proofToBig.bitLength()}-bit proof`
          );
        });

        it(`${p}-bit - ${algorithm} - strength: ${strength} - Verifier should be able to verify proof in the case of right password`, () => {
          const success = verifier.verify(proof, claim, secret);
          assert(success, 'Failed');
        });

        it(`${p}-bit - ${algorithm} - strength: ${strength} - Verification should fail in the case of wrong password`, async () => {
          proof = client.getProof(proofRequest, 'wrong-password', algorithm);
          const success = verifier.verify(proof, claim, secret);
          assert(!success, 'Failed');
        });
      });
    });
  });
});
