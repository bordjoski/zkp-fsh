# zkp-fish

#### The library is made as a proof of concept only and it was not reviewed by anyone. Part of learning curve and not ment to be used in production enviroment.

Helper methods enabling authentication without compromising the password and without shared or public keys.\
Implements non-interactive random oracle access method for Zero Knowladge Proof - Fiat-Shamir heuristic.

### Password based authentication system
In the case password based authentication system is required, it is worth considering applying a method which would prevent exposing the passwords over the network and which does not require storing hashed passwords in the storage. Method used in the library is know as Fiat-Shamir heuristic

#### Registration process:

1. Client and Verifier agree on prime number and generator to be used
2. Client calculates registration value based on prime number, generator value and password value and sends result to Verifier

#### Sign in proccess:

1. Client calculates sign in value based on prime, generator and random value and sends it to Verifier
2. Verifier picks a random number and gives it to the Client to solve a challange
3. Client calculates a challange result and sends result back to Verifier
4. Verifier calculates if result is correct
5. Client has prooven to know a password

### Installation

`npm install zkp-fish --save`

### Example Usage

#### Calculate registration value

`const zkpfsh = require('zkp-fish');`\
Client and Verifier must agree on prime and generator:\
`const prime = await zkpfsh.Utils.getPrime(1024);`\
`const generator = 2;`\
Client generates registration value based on password value:\
`const client = new zkpfsh.Client(prime, generator);`\
`const registrationValue = client.getRegistrationValue('password');`

#### Calculate sign in value
`const signInValue = client.getSignInValue();`

#### Proove that Client still knows the password
Client must be able to solve a challange given by Verifier\
`const verifier = new zkpfsh.Verifier(prime, generator);`\
`const challange = verifier.getChallange();`\
`const solvedChallange = client.solveChallange('password', challange);`

#### Verify that Client still knows the password
`const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);`

### References, Credits and Links
- Code snippets in Python and article by Prof Bill Buchanan: https://asecuritysite.com/encryption/fiat2
- Video presentation on specific topic by Prof Bill Buchanan: https://www.youtube.com/watch?v=n2WUJyk9cHA
- Original paper: How To Prove Yourself: Practical Solutions to Identification and Signature Problems: https://link.springer.com/content/pdf/10.1007/3-540-47721-7_12.pdf
- forge documentation https://www.npmjs.com/package/node-forge
- bigInt library https://www.npmjs.com/package/big-integer
- mathjs documentation: https://mathjs.org/
- npm module boilerplate: https://github.com/flexdinesh/npm-module-boilerplate
