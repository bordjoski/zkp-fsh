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

`const zkpfsh = require('zkp-fsh');`\
`// Client and Verifier must agree on prime and generator:`\
`const prime = await zkpfsh.Utils.getPrime(1024);`\
`const generator = 2;`\
`// Generate registration value:`\
`const client = new zkpfsh.Client(prime, generator);`\
`const registrationValue = client.getRegistrationValue('password');`

Output of registration value looks something like this:
```
81918083630528027677520801024673501504780377281353811262781583693290561188427768639436327540450677145030881356803139751493215103228371635399570220034892957774900637820715200392893486722364960314636330324326270540056429637516435175738920183492178741298866649519579841232311208766933074173045033491571187135198n
```
Now, output value should be saved by verifier.

#### Calculate sign in value
`const signInValue = client.getSignInValue();`\

#### Proove that Client still knows the password
`// calculate result based on random number picked by verifier`\
`const solvedChallange = client.solveChallange(clientPassword, verifier.random);`

#### Verify that Client still knows the password
`const verifier = new zkpfsh.Verifier(prime, generator);`\
`const success = verifier.verifyChallange(solvedChallangeByClient, registrationValue, signInValue);`

### References, Credits and Links
- Code snippets and lectures by Prof Bill Buchanan: https://asecuritysite.com
- Video presentation on specific topic by Prof Bill Buchanan: https://www.youtube.com/watch?v=n2WUJyk9cHA
- Original paper: How To Prove Yourself: Practical Solutions to Identification and Signature Problems: https://link.springer.com/content/pdf/10.1007/3-540-47721-7_12.pdf
- forge documentation https://www.npmjs.com/package/node-forge
- bigInt library https://www.npmjs.com/package/big-integer
- mathjs documentation: https://mathjs.org/
- npm module boilerplate: https://github.com/flexdinesh/npm-module-boilerplate