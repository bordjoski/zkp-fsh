# zkp-fish

#### The library is made as a proof of concept only and it was not reviewed by anyone. Part of learning curve and not ment to be used in production enviroment.

Helper methods enabling authentication without compromising the password and without shared or public keys.\
Implements non-interactive random oracle access method for Zero Knowladge Proof - Fiat-Shamir heuristic.

### Password based authentication system
In the case password based authentication system is required, it is worth considering applying a method which would prevent exposing the passwords over the network and which does not require storing hashed passwords in the storage. Method used in the library is know as Fiat-Shamir heuristic

### Installation

`npm install zkp-fish --save`

### Usage
`const zkpfsh = require('zkp-fish');`

#### Registration process:

1. Client and Verifier makes agreement (which by default uses 1024-bit prime number)\
`const agreement = await zkpfsh.Agreement.generateAgreement();`\

`const client = new zkpfsh.Client(agreement);`\
`const verifier = new zkpfsh.Verifier(agreement);`

2. Client calculates a secret based on provided agreement and password and sends result to Verifier.\
`const secret = client.getSecret('password');`

#### Authentication proccess:

1. Client provides a claim - value based on agreement and internal authentication process identifier and sends it to Verifier\
`const claim = client.getClaim();`

2. Verifier generates a proof request and sends it to the client\
`const proofRequest = verifier.getProofRequest();`

3. Client calculates a proof based on recieved proof request and sends result back to Verifier\
`const proof = client.getProof(proofRequest, 'password');`

4. Verifier tries to verify a claim\
`const success = verifier.verify(claim, proof, secret);`

5. Client has prooven to know a password

### References, Credits and Links
- Code snippets in Python and article by Prof Bill Buchanan: https://asecuritysite.com/encryption/fiat2
- Video presentation on specific topic by Prof Bill Buchanan: https://www.youtube.com/watch?v=n2WUJyk9cHA
- Original paper: How To Prove Yourself: Practical Solutions to Identification and Signature Problems: https://link.springer.com/content/pdf/10.1007/3-540-47721-7_12.pdf
- forge documentation https://www.npmjs.com/package/node-forge
- bigInt library https://www.npmjs.com/package/big-integer
- mathjs documentation: https://mathjs.org/
- npm module boilerplate: https://github.com/flexdinesh/npm-module-boilerplate
