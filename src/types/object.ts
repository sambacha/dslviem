import { Type } from './base';
import { 
  Block, 
  Transaction, 
  TransactionReceipt, 
  Log,
  FeeHistory
} from 'viem';

/**
 * Block type
 * Represents an Ethereum block
 */
export class TBlock extends Type<Block> {
  name = 'Block';
  
  isValid(value: unknown): value is Block {
    if (typeof value !== 'object' || value === null) return false;
    
    // Basic validation of Block structure
    const block = value as Partial<Block>;
    return (
      typeof block.hash === 'string' &&
      typeof block.number === 'bigint' &&
      typeof block.timestamp === 'bigint'
    );
  }
  
  unrollValue(block: Block): Record<string, any> {
    const result: Record<string, any> = { rv: block };
    
    // Extract important properties
    result['rv.hash'] = block.hash;
    result['rv.number'] = block.number;
    result['rv.timestamp'] = block.timestamp;
    result['rv.parentHash'] = block.parentHash;
    result['rv.miner'] = block.miner;
    
    return result;
  }
}

/**
 * Transaction type
 * Represents an Ethereum transaction
 */
export class TTransaction extends Type<Transaction> {
  name = 'Transaction';
  
  isValid(value: unknown): value is Transaction {
    if (typeof value !== 'object' || value === null) return false;
    
    // Basic validation of Transaction structure
    const tx = value as Partial<Transaction>;
    return (
      typeof tx.hash === 'string' &&
      typeof tx.from === 'string'
    );
  }
  
  unrollValue(tx: Transaction): Record<string, any> {
    const result: Record<string, any> = { rv: tx };
    
    // Extract important properties
    result['rv.hash'] = tx.hash;
    result['rv.from'] = tx.from;
    result['rv.to'] = tx.to;
    result['rv.value'] = tx.value;
    result['rv.nonce'] = tx.nonce;
    
    return result;
  }
}

/**
 * Transaction Receipt type
 * Represents an Ethereum transaction receipt
 */
export class TTransactionReceipt extends Type<TransactionReceipt> {
  name = 'TransactionReceipt';
  
  isValid(value: unknown): value is TransactionReceipt {
    if (typeof value !== 'object' || value === null) return false;
    
    // Basic validation of TransactionReceipt structure
    const receipt = value as Partial<TransactionReceipt>;
    return (
      typeof receipt.transactionHash === 'string' &&
      typeof receipt.blockNumber === 'bigint' &&
      Array.isArray(receipt.logs)
    );
  }
  
  unrollValue(receipt: TransactionReceipt): Record<string, any> {
    const result: Record<string, any> = { rv: receipt };
    
    // Extract important properties
    result['rv.transactionHash'] = receipt.transactionHash;
    result['rv.blockNumber'] = receipt.blockNumber;
    result['rv.status'] = receipt.status;
    
    return result;
  }
}

/**
 * Log type
 * Represents an Ethereum event log
 */
export class TLog extends Type<Log> {
  name = 'Log';
  
  isValid(value: unknown): value is Log {
    if (typeof value !== 'object' || value === null) return false;
    
    // Basic validation of Log structure
    const log = value as Partial<Log>;
    return (
      typeof log.address === 'string' &&
      typeof log.blockNumber === 'bigint' &&
      Array.isArray(log.topics)
    );
  }
  
  unrollValue(log: Log): Record<string, any> {
    const result: Record<string, any> = { rv: log };
    
    // Extract important properties
    result['rv.address'] = log.address;
    result['rv.blockNumber'] = log.blockNumber;
    result['rv.data'] = log.data;
    
    return result;
  }
}

/**
 * Fee History type
 * Represents Ethereum fee history data
 */
export class TFeeHistory extends Type<FeeHistory> {
  name = 'FeeHistory';
  
  isValid(value: unknown): value is FeeHistory {
    if (typeof value !== 'object' || value === null) return false;
    
    // Basic validation of FeeHistory structure
    const feeHistory = value as Partial<FeeHistory>;
    return (
      Array.isArray(feeHistory.baseFeePerGas) &&
      Array.isArray(feeHistory.gasUsedRatio) &&
      typeof feeHistory.oldestBlock === 'bigint'
    );
  }
  
  unrollValue(feeHistory: FeeHistory): Record<string, any> {
    const result: Record<string, any> = { rv: feeHistory };
    
    // Extract important properties
    result['rv.oldestBlock'] = feeHistory.oldestBlock;
    
    return result;
  }
}
