const EC = require('elliptic').ec; // allows for generation for private and public keys, sign and verify a signature
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const privateKey = key.getPrivate('hex');
const publicKey = key.getPublic('hex');

console.log();
console.log('Private key:', privateKey);

console.log();
console.log('Public key:', publicKey);