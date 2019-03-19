import { assert } from 'chai';

import { Client, Verifier, Utils } from '../src';

const clientPassword = 'password';
let registrationValue;
let signInValue;
let solvedChallange;
let client;
let verifier;
let prime;

describe('Library test', () => {
  it('Should generate large prime', async () => {
    prime = await Utils.getPrime();
    assert(prime, `${prime} invalid`);
  });

  it('Should generate valid registration value', () => {
    client = new Client(prime, 2, 'sha384');
    verifier = new Verifier(prime);
    console.log('client random', client.random);
    console.log('verifier r', verifier.random);
    registrationValue = client.getRegistrationValue(clientPassword);
    console.log('registration value', registrationValue)
    assert(registrationValue, 'Registration value should not be NaN');
  });

  it('Should generate valid signin value', () => {
    signInValue = client.getSignInValue();
    console.log('Sign in value', signInValue);
    assert(!isNaN(signInValue), 'Sign in value should not be NaN');
  });

  it('Should solve a challange given by verifier', () => {
    solvedChallange = client.solveChallange(clientPassword, verifier.getChallange());
    console.log('Challange:', verifier.getChallange());
    console.log('Solved challange', solvedChallange);
    assert(!isNaN(solvedChallange), 'Sign in value should not be NaN');
  });

  it('Verifier should be able to verify in the case of right password', () => {
    const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
    assert(success, 'Should succeed');
  });

  it('Verification should fail in the case of wrong password', () => {
    solvedChallange = client.solveChallange('wrong-password', verifier.getChallange());
    const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
    assert(!success, 'Should fail');
  });
});

describe('Library test 2048', () => {
  it('Should generate large prime', async () => {
    prime = await Utils.getPrime(2048);
    assert(prime, `${prime} invalid`);
  });

  it('Should generate valid registration value', () => {
    client = new Client(prime, 7);
    verifier = new Verifier(prime, 7);
    // client.setR('1802206709237826556295356608202618426984878665250547145790558390204131329837417271866014639208455727634787578573664715633377436741481246981639275811446778245962604711197770348906976303514273035358507987067432775763581065203267374167269733879088205388553877313825124066491521235062792087434401674904402395136018022067092378265562953566082026184269848786652505471457905583902041313298374172718660146392084557276347875785736647156333774367414812469816392758114467782459626047111977703489069763035142730353585079870674327757635810652032673741672697338790882053885538773138251240664915212350627920874344016749044023951360');
    console.log('client random', client.random);
    console.log('verifier r', verifier.random);
    registrationValue = client.getRegistrationValue(clientPassword);
    console.log('registration value', registrationValue);
    assert(registrationValue, 'Registration value should not be NaN');
  });

  it('Should generate valid signin value', () => {
    signInValue = client.getSignInValue();
    console.log('sign in value', signInValue);
    assert(!isNaN(signInValue), 'Sign in value should not be NaN');
  });

  it('Should solve a challange given by verifier', () => {
    solvedChallange = client.solveChallange(clientPassword, verifier.getChallange());
    console.log('Challange:', verifier.getChallange());
    console.log('Solved challange', solvedChallange);
    assert(!isNaN(solvedChallange), 'Sign in value should not be NaN');
  });

  it('Verifier should be able to verify in the case of right password', () => {
    const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
    assert(success, 'Should succeed');
  });

  it('Verification should fail in the case of wrong password', () => {
    solvedChallange = client.solveChallange('wrong-password', verifier.getChallange());
    const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
    assert(!success, 'Should fail');
  });
});

// describe('Should scucceed with more interesting prime', () => {
//   it('Should generate large prime', async () => {
//     prime = '199685867303841037109139046067155175605292887937167702065830162416271862096379408906984204323488943149492958163278993069565160501197573396465435248806570979594994769727746339405953603766462591082927301253813085336170833769137933661313067858205541556788098081727569050623692427359668422389849419252528463216641996858673038410371091390460671551756052928879371677020658301624162718620963794089069842043234889431494929581632789930695651605011975733964654352488065709795949947697277463394059536037664625910829273012538130853361708337691379336613130678582055415567880980817275690506236924273596684223898494192525284632166419968586730384103710913904606715517560529288793716770206583016241627186209637940890698420432348894314949295816327899306956516050119757339646543524880657097959499476972774633940595360376646259108292730125381308533617083376913793366131306785820554155678809808172756905062369242735966842238984941925252846321664199685867303841037109139046067155175605292887937167702065830162416271862096379408906984204323488943149492958163278993069565160501197573396465435248806570979594994769727746339405953603766462591082927301253813085336170833769137933661313067858205541556788098081727569050623692427359668422389849419252528463216641996858673038410371091390460671551756052928879371677020658301624162718620963794089069842043234889431494929581632789930695651605011975733964654352488065709795949947697277463394059536037664625910829273012538130853361708337691379336613130678582055415567880980817275690506236924273596684223898494192525284632166419968586730384103710913904606715517560529288793716770206583016241627186209637940890698420432348894314949295816327899306956516050119757339646543524880657097959499476972774633940595360376646259108292730125381308533617083376913793366131306785820554155678809808172756905062369242735966842238984941925252846321664199685867303841037109139046067155175605292887937167702065830162416271862096379408906984204323488943149492958163278993069565160501197573396465435248806570979594994769727746339405953603766462591082927301253813085336170833769137933661313067858205541556788098081727569050623692427359668422389849419252528463216641996858673038410371091390460671551756052928879371677020658301624162718620963794089069842043234889431494929581632789930695651605011975733964654352488065709795949947697277463394059536037664625910829273012538130853361708337691379336613130678582055415567880980817275690506236924273596684223898494192525284632166419968586730384103710913904606715517560529288793716770206583016241627186209637940890698420432348894314949295816327899306956516050119757339646543524880657097959499476972774633940595360376646259108292730125381308533617083376913793366131306785820554155678809808172756905062369242735966842238984941925252846321664199685867303841037109139046067155175605292887937167702065830162416271862096379408906984204323488943149492958163278993069565160501197573396465435248806570979594994769727746339405953603766462591082927301253813085336170833769137933661313067858205541556788098081727569050623692427359668422389849419252528463216641996858673038410371091390460671551756052928879371677020658301624162718620963794089069842043234889431494929581632789930695651605011975733964654352488065709795949947697277463394059536037664625910829273012538130853361708337691379336613130678582055415567880980817275690506236924273596684223898494192525284632166419968586730384103710913904606715517560529288793716770206583016241627186209637940890698420432348894314949295816327899306956516050119757339646543524880657097959499476972774633940595360376646259108292730125381308533617083376913793366131306785820554155678809808172756905062369242735966842238984941925252846321664199685867303841037109139046067155175605292887937167702065830162416271862096379408906984204323488943149492958163278993069565160501197573396465435248806570979594994769727746339405953603766462591082927301253813085336170833769137933661313067858205541556788098081727569050623692427359668422389849419252528463216641996858673038410371091390460671551756052928879371677020658301624162718620963794089069842043234889431494929581632789930695651605011975733964654352488065709795949947697277463394059536037664625910829273012538130853361708337691379336613130678582055415567880980817275690506236924273596684223898494192525284632166419968586730384103710913904606715517560529288793716770206583016241627186209637940890698420432348894314949295816327899306956516050119757339646543524880657097959499476972774633940595360376646259108292730125381308533617083376913793366131306785820554155678809808172756905062369242735966842238984941925252846321664199685867303841037109139046067155175605292887937167702065830162416271862096379408906984204323488943149492958163278993069565160501197573396465435248806570979594994769727746339405953603766462591082927301253813085336170833769137933661313067858205541556788098081727569050623692427359668422389849419252528463216641996858673038410371091390460671551756052928879371677020658301624162718620963794089069842043234889431494929581632789930695651605011975733964654352488065709795949947697277463394059536037664625910829273012538130853361708337691379336613130678582055415567880980817275690506236924273596684223898494192525284632166419968586730384103710913904606715517560529288793716770206583016241627186209637940890698420432348894314949295816327899306956516050119757339646543524880657097959499476972774633940595360376646259108292730125381308533617083376913793366131306785820554155678809808172756905062369242735966842238984941925252846321664'
//     assert(prime, `${prime} invalid`);
//   });

//   it('Should generate valid registration value', () => {
//     client = new Client(prime, 7);
//     verifier = new Verifier(prime, 7);
//     console.log('client random', client.random);
//     console.log('verifier r', verifier.random);
//     registrationValue = client.getRegistrationValue(clientPassword);
//     assert(registrationValue, 'Registration value should not be NaN');
//   });

//   it('Should generate valid signin value', () => {
//     signInValue = client.getSignInValue();
//     console.log('Sign in value', signInValue);
//     assert(!isNaN(signInValue), 'Sign in value should not be NaN');
//   });

//   it('Should solve a challange given by verifier', () => {
//     solvedChallange = client.solveChallange(clientPassword, verifier.getChallange());
//     console.log('Challange:', verifier.getChallange());
//     console.log('Solved challange', solvedChallange);
//     assert(!isNaN(solvedChallange), 'Sign in value should not be NaN');
//   });

//   it('Verifier should be able to verify in the case of right password', () => {
//     const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
//     assert(success, 'Should succeed');
//   });

//   it('Verification should fail in the case of wrong password', () => {
//     solvedChallange = client.solveChallange('wrong-password', verifier.getChallange());
//     const success = verifier.verifyChallange(solvedChallange, registrationValue, signInValue);
//     assert(!success, 'Should fail');
//   });
// });