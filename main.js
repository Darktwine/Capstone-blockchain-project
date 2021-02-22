const SHA256 = require('crypto-js/sha256');

class Transaction{
	constructor(fromAddress, toAddress, amount){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block{
	constructor(timestamp, transactions, previousHash = ''){
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash(){
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
	}

	// POW implementation to prevent spam addition of blocks, and also for security, to prevent bad
	// actors from modifying a block, and recalcuating all the hashes after so it appears valid
	mineBlock(difficulty){
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
			this.nonce++;
			this.hash = this.calculateHash();
		}

		console.log("Block mined: " + this.hash);
	}
}



class Blockchain{
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock(){
		return new Block("01/01/2021", "Genesis block", "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress){
		let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
		block.mineBlock(this.difficulty);

		console.log("Block successfully mined!");
		this.chain.push(block);

		this.pendingTransactions = [
			new Transaction(null, miningRewardAddress, this.miningReward)
		];
	}

	createTransaction(transaction){
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address){
		let balance = 0;

		for(const block of this.chain){
			for(const trans of block.transactions){
				if(trans.fromAddress === address){
					balance -= trans.amount;
				}

				if(trans.toAddress === address){
					balance += trans.amount;
				}
			}
		}
		return balance;
	}

	isChainValid(){
		for(let i = 1; i < this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (currentBlock.hash !== currentBlock.calculateHash()){
				return false;
			}

			if(currentBlock.previousHash !== previousBlock.hash){
				return false;
			}
		}

		return true;
	}
}

// Creating an instance of the blockchain
let kevinCoin = new Blockchain();

// in reality address1 and address2 would be public key of someone's wallet
kevinCoin.createTransaction(new Transaction('address1', 'address2', 100));
kevinCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
kevinCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', kevinCoin.getBalanceOfAddress('xaviers-address'));

console.log('\n Starting the miner again...');
kevinCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', kevinCoin.getBalanceOfAddress('xaviers-address'));

// console.log('Is blockchain valid? ' + kevinCoin.isChainValid());
// console.log(JSON.stringify(kevinCoin, null, 4));

// kevinCoin.chain[1].data = { amount: 100 };
// kevinCoin.chain[1].hash = kevinCoin.chain[1].calculateHash();

// // no longer valid, because when you tamper with the data, the calculated hash will be 
// // different from the hash when it had originally been added with .addBlock() function
// console.log('Is blockchain valid? ' + kevinCoin.isChainValid());
// console.log(JSON.stringify(kevinCoin, null, 4));

