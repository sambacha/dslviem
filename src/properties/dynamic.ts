import { BaseVerifiableProperty } from './base';
import { PublicClient } from 'viem';

/**
 * Nonce property
 * Generates the next nonce for an address
 */
export class PNonce extends BaseVerifiableProperty<bigint> {
  name = '<Nonce>';
  private address: `0x${string}`;
  private client: PublicClient;
  
  constructor(address: `0x${string}`, client: PublicClient) {
    super();
    this.address = address;
    this.client = client;
  }
  
  async generate(): Promise<bigint> {
    // Try to use a verified value first
    const verified = this.getVerifiedValue();
    if (verified !== undefined) {
      return verified;
    }
    
    // Otherwise, get the current nonce from the blockchain
    const nonce = await this.client.getTransactionCount({
      address: this.address
    });
    
    // Ensure nonce is a bigint
    const nonceBigInt = BigInt(nonce);
    
    this.addVerifiedValue(nonceBigInt);
    return nonceBigInt;
  }
}

/**
 * Block number property
 * Generates block numbers
 */
export class PBlockNumber extends BaseVerifiableProperty<bigint> {
  name = '<BlockNumber>';
  private client: PublicClient;
  private maxBlock: bigint;
  
  constructor(client: PublicClient, maxBlock?: bigint) {
    super();
    this.client = client;
    this.maxBlock = maxBlock || 0n;
  }
  
  async generate(): Promise<bigint> {
    // Try to use a verified value first
    const verified = this.getVerifiedValue();
    if (verified !== undefined) {
      return verified;
    }
    
    // If we don't have a max block yet, get the current block number
    if (this.maxBlock === 0n) {
      this.maxBlock = await this.client.getBlockNumber();
    }
    
    // Generate a random block number between 0 and maxBlock
    const blockNumber = this.maxBlock > 0n ? 
      BigInt(Math.floor(Math.random() * Number(this.maxBlock))) : 
      0n;
    
    this.addVerifiedValue(blockNumber);
    return blockNumber;
  }
}

/**
 * Transaction hash property
 * Generates transaction hashes
 */
export class PTxHash extends BaseVerifiableProperty<`0x${string}`> {
  name = '<TxHash>';
  private client: PublicClient;
  
  constructor(client: PublicClient) {
    super();
    this.client = client;
  }
  
  async generate(): Promise<`0x${string}`> {
    // Try to use a verified value first
    const verified = this.getVerifiedValue();
    if (verified !== undefined) {
      return verified;
    }
    
    // Otherwise, get a recent block and extract a transaction hash
    const block = await this.client.getBlock({
      includeTransactions: true
    });
    
    if (block.transactions.length === 0) {
      throw new Error('No transactions found in the latest block');
    }
    
    // Get a random transaction from the block
    const tx = block.transactions[Math.floor(Math.random() * block.transactions.length)];
    
    // If the transaction is an object, extract the hash
    const hash = typeof tx === 'string' ? tx : tx.hash;
    
    this.addVerifiedValue(hash);
    return hash;
  }
}

/**
 * Block hash property
 * Generates block hashes
 */
export class PBlockHash extends BaseVerifiableProperty<`0x${string}`> {
  name = '<BlockHash>';
  private client: PublicClient;
  
  constructor(client: PublicClient) {
    super();
    this.client = client;
  }
  
  async generate(): Promise<`0x${string}`> {
    // Try to use a verified value first
    const verified = this.getVerifiedValue();
    if (verified !== undefined) {
      return verified;
    }
    
    // Otherwise, get a recent block and extract its hash
    const blockNumber = await this.client.getBlockNumber();
    
    // Get a random block number between 1 and the current block
    const randomBlockNumber = BigInt(Math.floor(Math.random() * Number(blockNumber)) + 1);
    
    const block = await this.client.getBlock({
      blockNumber: randomBlockNumber
    });
    
    this.addVerifiedValue(block.hash);
    return block.hash;
  }
}

/**
 * Transaction index property
 * Generates transaction indices for a block
 */
export class PTxIndex extends BaseVerifiableProperty<number> {
  name = '<TxIndex>';
  private client: PublicClient;
  private blockNumber: bigint;
  
  constructor(client: PublicClient, blockNumber: bigint) {
    super();
    this.client = client;
    this.blockNumber = blockNumber;
  }
  
  async generate(): Promise<number> {
    // Try to use a verified value first
    const verified = this.getVerifiedValue();
    if (verified !== undefined) {
      return verified;
    }
    
    // Otherwise, get the block and count its transactions
    const block = await this.client.getBlock({
      blockNumber: this.blockNumber,
      includeTransactions: true
    });
    
    if (block.transactions.length === 0) {
      throw new Error(`No transactions found in block ${this.blockNumber.toString()}`);
    }
    
    // Generate a random index
    const index = Math.floor(Math.random() * block.transactions.length);
    
    this.addVerifiedValue(index);
    return index;
  }
}

/**
 * Uncle index property
 * Generates uncle indices for a block
 */
export class PUncleIndex extends BaseVerifiableProperty<number> {
  name = '<UncleIndex>';
  private client: PublicClient;
  private blockNumber: bigint;
  
  constructor(client: PublicClient, blockNumber: bigint) {
    super();
    this.client = client;
    this.blockNumber = blockNumber;
  }
  
  async generate(): Promise<number> {
    // Try to use a verified value first
    const verified = this.getVerifiedValue();
    if (verified !== undefined) {
      return verified;
    }
    
    // Otherwise, get the block and count its uncles
    const block = await this.client.getBlock({
      blockNumber: this.blockNumber
    });
    
    if (!block.uncles || block.uncles.length === 0) {
      throw new Error(`No uncles found in block ${this.blockNumber.toString()}`);
    }
    
    // Generate a random index
    const index = Math.floor(Math.random() * block.uncles.length);
    
    this.addVerifiedValue(index);
    return index;
  }
}
