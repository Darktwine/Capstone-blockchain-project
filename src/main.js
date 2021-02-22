const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Initialize keys
const myKey = ec.keyFromPrivate('11a8969d6339f57c3eb2139cc29b188d7bca942de260fabfb40fd972b26d4685');
const myWalletAddress = myKey.getPublic('hex');



// Creating an instance of the blockchain
let kevinCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
kevinCoin.addTransaction(tx1);


// in reality address1 and address2 would be public key of someone's wallet
// kevinCoin.createTransaction(new Transaction('address1', 'address2', 100));
// kevinCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
kevinCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of xavier is', kevinCoin.getBalanceOfAddress(myWalletAddress));

kevinCoin.chain[1].transactions[0].amount = 1;

console.log('Is chain valid?', kevinCoin.isChainValid());

// console.log('\n Starting the miner again...');
// kevinCoin.minePendingTransactions('xaviers-address');

// console.log('\nBalance of xavier is', kevinCoin.getBalanceOfAddress('xaviers-address'));

// console.log('Is blockchain valid? ' + kevinCoin.isChainValid());
// console.log(JSON.stringify(kevinCoin, null, 4));

// kevinCoin.chain[1].data = { amount: 100 };
// kevinCoin.chain[1].hash = kevinCoin.chain[1].calculateHash();

// // no longer valid, because when you tamper with the data, the calculated hash will be 
// // different from the hash when it had originally been added with .addBlock() function
// console.log('Is blockchain valid? ' + kevinCoin.isChainValid());
// console.log(JSON.stringify(kevinCoin, null, 4));

