# zkp-fish

#### Developed as proof of concept only and not reviewed by anyone. Part of learning curve and not ment to be used in production enviroment!
#
Helper methods enabling authentication without compromising the password and without shared or public keys.\
Implements non-interactive random oracle access method for Zero Knowladge Proof - Fiat-Shamir heuristic.

### Password based authentication system
In the case password based authentication system is required, it is worth considering applying a method which would prevent exposing the passwords over the network and which does not require storing hashed passwords in the storage. Method used in the library is know as Fiat-Shamir heuristic

### Installation

`npm install zkp-fish --save`

### Usage
`const zkpfsh = require('zkp-fish');`

#### Registration process:

1. Generate agreement\
`const agreement = await zkpfsh.Agreement.generateAgreement();`

2. Make agreement between Client and Verifier\
`const client = new zkpfsh.Client(agreement);`\
`const verifier = new zkpfsh.Verifier(agreement);`

3. Client calculates a secret based on provided agreement and password and sends result to Verifier to store.\
`const secret = client.getSecret('password');`\
Optionaly, algorithm can be specified with second parameter. Acceptable algorithms are: `md5, sha1, sha256, sha384, sha512`.\
Note that same algorithm must be used later in `client.getProof` method. Default is `md5`.

#### Authentication proccess:

1. Client calculates a claim and provides it to Verifier'\
`const claim = client.getClaim();`

2. Verifier generates a proof request and sends it to the client\
`const proofRequest = verifier.getProofRequest();`

3. Client calculates a proof based on recieved proof request and sends result back to Verifier\
`const proof = client.getProof(proofRequest, 'password');`\
Optionaly, algorithm can be specified with third parameter and must be the same one used in registration process. Default is `md5`.

4. Verifier tries to verify a claim\
`const success = verifier.verify(proof, claim, secret);`

5. Client has prooven to know a password

#### Agreement configuration

Agreement is valid when generated with at least 128-bit prime number.\
By default it uses 1024-bit prime number and has default strength 1.

Example of initialization of agreement with 512-bit prime number and given strength 1.5:\
`const agreement = await zkpfsh.Agreement.generateAgreement(512, 1.5);`

Strength can be in range 1 - 2 and it affects size of the proof (produced by Client) and size of the proof request (produced by Verifier), meaning that bit length of the proof in the case of Client (or bit length of the proof request in the case of Verifier) devided by bit length of agreement is equal to given strength multiplied by 8

Agreement can be re-creacted from serialized data produced with `agreement.toJSON()` as follows:

`const agreement = await zkpfsh.Agreement.generateAgreement();`\
`const serialized = agreement.toJSON();`\
`const recreatedAgreement = zkpfsh.Agreement.fromJSON(serialized);`

Optionaly, agreement can be configured to use custom base and alphabet during conversion process. Default base is `10` and default alphabet is `0123456789abcdefghijklmnopqrstuvwxyz`.\
If used, configuration must be done manualy both on Client and Verifier side and must be identical to be able to deserialize data.\
Configuration details are not included in serialized Agreement.

Example:\
`const agreement = await zkpfsh.Agreement.generateAgreement();`\
`const config = { base: 2, alphabet: '#%' };`\
`agreement.configure(config);`

Instance of agreement from JSON:

`const agreement = zkpfsh.Agreement.fromJSON(serialized, config);`

By doing this, all data produced by Client or Verifier will use same custom base and alphabet.\
To simply, when using 128-bit agreement with strenght 1 and with default configuration (base `10` and alphabet `Agreement.DEFAULT_ALPHABET`), Client produces following proof:

`-200345974380536291602725340614948917409816195203413245753080625006499251713236934863588294738934992481943703364096134422837307179750837285113724140690445009756433154598234359420111126539059118282952710603288623794827633859198317004414338157411479955408393374957865885795838352968784319613283799204152403428463482437731`

On the other hand, when provided configuration is defined as `{ base: 2, alphabet: '#%' }`, proof would look like:

`-%#%###%%#%%###%%##%%##%#%%%###%%%%%##%%%%#%%#%%##%##%#%#%##%#%%#%%%##%#%######%#%%#%%%%%%##%######%%%%####%%##%####%%##%%%%%%%#%####%#######%%%##%%#%%##%#####%%%##%#%##%%%##%%%%%#%%%##%%%###%##%##%%#%%#%##%%#%#%%%%##%##%###%#%%%%##%%%#%%%%##%#%%%###%%%%%###%####%%%%##%%#%##%#%%%%%##%##%#%%##%%%#%%%####%#%#%%%%##%%#%####%#%#%##%#%#%#%%%######%###%%#%###%#%%%#%##%%%%%##%%%#%#%#%#%%%##%##%#%###%%%%#%###%#%#%%###%%%#%%###%%%%%#%%##%####%%%#%##%###%##%%##%%%#%##%%%%%####%%##%#%#%#%%%%%%######%####%%%##%#%%#%#%#%%%%%%#%#%%%#%%%#%%%%##%%#%#%%##%%%%#%%#%####%%%##%##%%%%#####%#%#%%####%##%%##%###%%##%%%#%%##%%######%%######%%#%%%%#%%##%##%%###%%%#%###%%#%%#%%##%%#%%%##%%#%####%#%#%##%%%#%%##%%#%#%#%%#%##%%#%%#####%##%%%%%%%###%%#%#%%#%%%######%##%##%%%%%#%%%%%#%##%#####%%%%%%#%#%#%#%#%##%%#######%%%%##%%###%##%#%#%%####%#%%%%%##%%%#%%%####%###%#%#%######%%%##%####%%%#%%#####%%%%#%#%%#%%##%##%#%#%####%#%%%#%%%%###%%%###%######%###%#%%%#%%%###%##%%%%#%#%%%%#%#%#%#%#%#%###%#%#####%%#%##%%%###%%#%%%####%%%#%%%######%%%%%#%%#%##%####%%%#%#%##%%%%##%#%#%#`

In the both cases, proof has valid format as long as the same configuration is used by Client and Verifier.\
This is optional as it does not improove security much but it comes handy if custom outputs are desired.

#### Runing the tests

If you are interested in running the tests, clone the repo, install dependecies and run

`npm run test:only`

It will run the tests with defferent strengths, algorithms and sizes.

### References, Credits and Links
- Code snippets in Python and article by Prof Bill Buchanan: https://asecuritysite.com/encryption/fiat2
- Video presentation on specific topic by Prof Bill Buchanan: https://www.youtube.com/watch?v=n2WUJyk9cHA
- Original paper: How To Prove Yourself: Practical Solutions to Identification and Signature Problems: https://link.springer.com/content/pdf/10.1007/3-540-47721-7_12.pdf
- forge documentation https://www.npmjs.com/package/node-forge
- bigInt library https://www.npmjs.com/package/big-integer
- mathjs documentation: https://mathjs.org/
- npm module boilerplate: https://github.com/flexdinesh/npm-module-boilerplate
