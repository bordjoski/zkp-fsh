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
    describe(`${p}bit library test with agreement strength ${strength.toString()}`, () => {
      it(`${p}bit test - Should be able to generate valid agreement with given bit length`, async () => {
        agreement = await Agreement.generateAgreement(p, strength);
        assert(agreement.isValid, 'Invalid agreement');
        assert(agreement.bitLength === p, `Invalid prime size ${agreement.bitLength}. Expected ${p}`);
      });
      algs.map(async (algorithm) => {
        it(`${p}bit - ${algorithm} test - Client should be able generate valid secret`, () => {
          client = new Client(agreement);
          secret = client.getSecret(password, algorithm);
          assert(
            Math.round(agreement.bitLength / secret.bitLength()) === 1,
            `Unecpected secret with ${secret.bitLength()} lentgh`
          );
        });

        it(`${p}bit - ${algorithm} test - Client should be able generate valid claim`, () => {
          claim = client.getClaim();
          assert(
            Math.round(agreement.bitLength / claim.bitLength()) === 1,
            `Unecpected claim value with ${claim.bitLength()} lentgh`
          );
        });

        it(`${p}bit - ${algorithm} test - Verifier should be able generate valid proof request`, () => {
          verifier = new Verifier(agreement);
          proofRequest = verifier.getProofRequest();
          assert(
            Math.round(proofRequest.bitLength() / agreement.bitLength) === Math.round(8 * agreement.strength),
            `Invalid proof request with ${proofRequest.bitLength()} length`
          );
        });

        it(`${p}bit - ${algorithm} test - Client should be able to produce valid proof`, () => {
          proof = client.getProof(proofRequest, password, algorithm);
          assert(
            Math.round(proof.bitLength() / agreement.bitLength) === Math.round(8 * agreement.strength),
            `Invalid proof with ${proof.bitLength()} length`
          );
        });

        it(`${p}bit - ${algorithm} test - Verifier should be able to verify proof in the case of right password`, () => {
          const success = verifier.verify(claim, proof, secret);
          assert(success, 'Failed');
        });

        it(`${p}bit - ${algorithm} test - Verification should fail in the case of wrong password`, async () => {
          proof = client.getProof(proofRequest, 'wrong-password', algorithm);
          const success = verifier.verify(claim, proof, secret);
          assert(!success, 'Failed');
        });
      });
    });
  });
});
