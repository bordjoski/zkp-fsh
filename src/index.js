/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 * Helper methods enabling user authentication without compromising the password
 * and without shared or public keys.
 * Implements non-interactive random oracle access method for Zero Knowladge Proof.
 * Fiat-Shamir heuristic
 * @see https://asecuritysite.com/encryption/fiat2
 * @see https://link.springer.com/content/pdf/10.1007/3-540-47721-7_12.pdf
 * @see https://docs.oracle.com/cd/E19424-01/820-4811/gdzeq/index.html reminder on how not to :)
 */

import 'babel-polyfill';
import Verifier from './verifier';
import Client from './client';
import Utils from './utils';
import Agreement from './agreement';

export {
  Verifier,
  Client,
  Utils,
  Agreement
};
