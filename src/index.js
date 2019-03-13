/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 * Helper methods enabling user to prove identity without compromising the password
 * and without shared or public keys.
 * Implements non-interactive random oracle access method for Zero Knowladge Proof.
 * Fiat-Shamir heruistic
 * @see https://link.springer.com/content/pdf/10.1007/3-540-47721-7_12.pdf
 */
import Verifier from './verifier';
import Client from './client';
import Utils from './utils';

export {
  Verifier,
  Client,
  Utils,
};
