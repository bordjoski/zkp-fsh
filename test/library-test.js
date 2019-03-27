import { assert } from 'chai';
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
        assert(agreement.isValid, 'Invalid agreement');
        assert(agreement.bitLength === p, `Invalid prime size ${agreement.bitLength}. Expected ${p}`);
      });
      algs.map(async (algorithm) => {
        it(`${p}-bit - ${algorithm} - strength: ${strength} - Client should be able generate secret with valid length`, () => {
          client = new Client(agreement);
          secret = client.getSecret(password, algorithm);
          assert(
            Math.round(agreement.bitLength / secret.bitLength()) === 1,
            `Unecpected ${secret.bitLength()}-bit secret`
          );
        });

        it(`${p}-bit - ${algorithm} - strength: ${strength} - Client should be able generate claim with valid size`, () => {
          claim = client.getClaim();
          assert(
            Math.round(agreement.bitLength / claim.bitLength()) === 1,
            `Unecpected ${claim.bitLength()}-bit claim`
          );
        });

        it(`${p}-bit - ${algorithm} - strength: ${strength} - Verifier should be able generate proof request with valid size`, () => {
          verifier = new Verifier(agreement);
          proofRequest = verifier.getProofRequest();
          // console.log(proofRequest);
          assert(
            Math.round(proofRequest.bitLength() / agreement.bitLength) === Math.round(8 * agreement.strength),
            `Invalid ${proofRequest.bitLength()}-bit proof request`
          );
        });

        it(`${p}-bit - ${algorithm} - strength: ${strength} - Client should be able to produce proof with valid size`, () => {
          proof = client.getProof(proofRequest, password, algorithm);
          // console.log(proof);
          assert(
            Math.round(proof.bitLength() / agreement.bitLength) === Math.round(8 * agreement.strength),
            `Invalid ${proof.bitLength()}-bit proof`
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
