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

1. Define agreement (which by default uses 1024-bit prime number) and has default strength 1\
`const agreement = await zkpfsh.Agreement.generateAgreement();`\
If you would like to generate agreement with 512-bit prime number and strength 1.5:\
`const agreement = await zkpfsh.Agreement.generateAgreement(512, 1.5);`\
Strength can be in range 1 - 2 and it affects size of proof (produced by Client) and size of proof request (produced by Verifier)

2. Make agreement between Client and Verifier\
`const client = new zkpfsh.Client(agreement);`\
`const verifier = new zkpfsh.Verifier(agreement);`

3. Client calculates a secret based on provided agreement and password and sends result to Verifier.\
`const secret = client.getSecret('password');`

#### Authentication proccess:

1. Client provides a claim to Verifier - value based on agreement and internal authentication process identifier (random number) and sends it to Verifier\
`const claim = client.getClaim();`

2. Verifier generates a proof request and sends it to the client\
`const proofRequest = verifier.getProofRequest();`

3. Client calculates a proof based on recieved proof request and sends result back to Verifier\
`const proof = client.getProof(proofRequest, 'password');`

4. Verifier tries to verify a claim\
`const success = verifier.verify(proof, claim, secret);`

5. Client has prooven to know a password

#### Agreement configuration

Agreement can be re-creacted from serialized data produced with `agreement.toJSON()` as follows:

`const agreement = await zkpfsh.Agreement.generateAgreement();`\
`const serialized = agreement.toJSON();`\
`const recreatedAgreement = zkpfsh.Agreement.fromJSON(serialized);`

Optionaly, agreement can be configured to use custom base and alphabet during conversion process. Default base is `10` and default alphabet is `0123456789abcdefghijklmnopqrstuvwxyz`.\
If used, configuration must be done manualy both on Client and Verifier side and must be identical to be able to deserialize data.\
Configuration details is not included in serialized Agreement.\
Example:

`const agreement = await zkpfsh.Agreement.generateAgreement();`\
`const config = { base: 2, alphabet: '#%' };`\
`agreement.configure(config);`

Or when re-creating agreement from JSON:

`const serialized = agreement.toJSON();`\
`const recreatedAgreement = zkpfsh.Agreement.fromJSON(serialized, config);`

By doing this, all data produced by Client or Verifier will use same base and alphabet.


### References, Credits and Links
- Code snippets in Python and article by Prof Bill Buchanan: https://asecuritysite.com/encryption/fiat2
- Video presentation on specific topic by Prof Bill Buchanan: https://www.youtube.com/watch?v=n2WUJyk9cHA
- Original paper: How To Prove Yourself: Practical Solutions to Identification and Signature Problems: https://link.springer.com/content/pdf/10.1007/3-540-47721-7_12.pdf
- forge documentation https://www.npmjs.com/package/node-forge
- bigInt library https://www.npmjs.com/package/big-integer
- mathjs documentation: https://mathjs.org/
- npm module boilerplate: https://github.com/flexdinesh/npm-module-boilerplate
