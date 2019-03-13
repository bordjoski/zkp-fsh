# zkp-fsh
Helper methods and proof of concept library enabling user to prove identity without compromising the password and without shared or public keys.\
Implements non-interactive random oracle access method for Zero Knowladge Proof - Fiat-Shamir heruistic.\
Designed to work in nodejs enviroment

### Password based authentication system
In the case password based authentication system is required, it is wise to consider applying a method which would prevent exposing the passwords over the network and which does not require storing hashed passwords in the storage. Method used in the library is know as Fiat-Shamir heruistic

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

`npm install zkp-fsh --save`

### Example Usage

#### Calculate registration value
`import { Client, Utils, Verifier } from 'zkp-fsh';`\
`// Client and Verifier must agree on prime and generator:`\
`const prime = Utils.getPrime(100000, 1000000);`\
`const generator = Utils.getGenerator(prime);`\
`// Generate registration value:`\
`const client = new Client(prime,generator);`\
`const registrationValue = client.getRegistrationValue('client password');`

#### Calculate sign in value
`const signInValue = client.getSignInValue();`

#### Proove that Client still knows the password
`// calculate result based on picked number by verifier`\
`const solvedChallange = client.solveChallange(clientPassword, verifier.random);`

#### Proove that Client still knows the password
`const verifier = new Verifier(prime,generator);`\
`const success = verifier.verifyChallange(solvedChallangeByClient, registrationValue, signInValue);`

### References
- Original paper: How To Prove Yourself: Practical Solutions to Identification and Signature Problems: https://link.springer.com/content/pdf/10.1007/3-540-47721-7_12.pdf
- Code snippets and lectures by Prof Bill Buchanan: https://asecuritysite.com
- Modified version of Sieve of Sundaram algorithm https://stackoverflow.com/questions/11966520
- Extended Euclidean algorithm https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
- Forge documentation https://www.npmjs.com/package/node-forge
- bigInt library https://www.npmjs.com/package/big-integer
- mathjs documentation: https://mathjs.org/