/**
 * @author Mirko Bordjoski <mirko.bordjoski@gmail.com>, 2019
 */

import bigInt from 'big-integer';
import forge from 'node-forge';

/**
 * Utils class provides helper methods for calculating prime numbers
 */
class Utils {
  /**
   * Returns random large prime number both initiator
   * and verifier will agree to use.
   */
  static async getLargePrime(bits = 2048) {
    return new Promise((resolve, reject) => {
      // generate a random prime on the main JS thread
      forge.prime.generateProbablePrime(bits, (err, num) => {
        if (err) {
          reject(err);
        }
        resolve(num);
      });
    });
  }

  /**
   * Returns random prime number in given range both initiator
   * and verifier will agree to use.
   */
  static getPrime(min, max) {
    const primes = Utils.getPrimesInRange(min, max);
    const randomPrimeIndex = Utils.inRange(0, primes.length);
    return primes[randomPrimeIndex];
  }

  /**
   * Returns a generator based on provided prime number
   * @param {Number} prime Agreed prime number
   */
  static getGenerator(prime) {
    for (let i = 1; i <= prime; i++) {
      let exp = 1;
      let next = i % prime;
      while (next !== 1) {
        next = (next * i) % prime;
        exp++;

        if (exp === prime - 1) {
          return i;
        }
      }
    }
    return 2;
  }

  /**
   * Get random value in range of given number
   * @param {Number} max Agreed prime number
   */
  static getRandomValue(max) {
    return Utils.inRange(max * 0.1, max);
  }

  /**
   * Modified version of Sieve of Sundaram algorithm
   * @param {Number} min Min
   * @param {Number} max Max
   * @see https://stackoverflow.com/questions/11966520
   */
  static getPrimesInRange(min, max) {
    const n = Math.floor(max * 0.5);

    const a = Array(n);
    const t = (Math.sqrt(4 + 8 * n) - 2) * 0.25;
    const r = [];

    let u = 0;
    let i = 1;

    for (i = 1; i < (n - 1) / 3; i++) {
      a[1 + 3 * i] = true;
    }

    for (i = 2; i <= t; i++) {
      u = (n - i) / (1 + 2 * i);
      if (i % 3 - 1) {
        for (let j = i; j < u; j++) {
          a[i + j + 2 * i * j] = true;
        }
      }
    }

    for (i = min; i < n; i++) {
      !a[i] && r.push(i * 2 + 1);
    }

    return r;
  }

  /**
   * Returns random number in given range
   * @param {Number} min
   * @param {Number} max
   */
  static inRange(min, max) {
    const minx = Math.ceil(min);
    const maxx = Math.floor(max);
    return Math.floor(Math.random() * (maxx - minx + 1)) + minx;
  }

  /**
   * Check if given number is prime
   * @param {Number} prime Agreed prime number
   */
  static isPrime(prime) {
    return bigInt(prime).isPrime();
  }
}

export default Utils;
