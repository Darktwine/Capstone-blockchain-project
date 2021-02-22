const SHA256 = require('crypto-js/sha256');

class Block{
	constructor(index, timestamp, data, previousHash = ''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
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
		this.difficulty = 3;
	}

	createGenesisBlock(){
		return new Block(0, "01/01/2021", "Genesis block", "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
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

console.log("Mining block 1...");
kevinCoin.addBlock(new Block(1, "01/05/2021", { amount: 5}));

console.log("Mining block 2...");
kevinCoin.addBlock(new Block(2, "01/07/2021", { amount: 10}));

// console.log('Is blockchain valid? ' + kevinCoin.isChainValid());
// console.log(JSON.stringify(kevinCoin, null, 4));

// kevinCoin.chain[1].data = { amount: 100 };
// kevinCoin.chain[1].hash = kevinCoin.chain[1].calculateHash();

// // no longer valid, because when you tamper with the data, the calculated hash will be 
// // different from the hash when it had originally been added with .addBlock() function
// console.log('Is blockchain valid? ' + kevinCoin.isChainValid());
// console.log(JSON.stringify(kevinCoin, null, 4));

