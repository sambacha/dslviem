import { Type } from './base';
import { isAddress, isHex } from 'viem';

/**
 * Ethereum address type
 * Represents a valid Ethereum address (0x followed by 40 hex characters)
 */
export class TAddress extends Type<`0x${string}`> {
  name = 'Address';
  
  isValid(value: unknown): value is `0x${string}` {
    return typeof value === 'string' && isAddress(value);
  }
}

/**
 * Hexadecimal string type
 * Represents any hexadecimal string with 0x prefix
 */
export class THex extends Type<`0x${string}`> {
  name = 'Hex';
  
  isValid(value: unknown): value is `0x${string}` {
    return typeof value === 'string' && isHex(value);
  }
}

/**
 * 32-byte hexadecimal string type
 * Represents a 32-byte hash (0x followed by 64 hex characters)
 */
export class THex32 extends Type<`0x${string}`> {
  name = 'Hex32';
  
  isValid(value: unknown): value is `0x${string}` {
    return typeof value === 'string' && 
           isHex(value) && 
           value.length === 66; // 0x + 64 hex chars
  }
}

/**
 * Block tag type
 * Represents a named block identifier like 'latest', 'earliest', etc.
 */
export class TBlockTag extends Type<'latest' | 'earliest' | 'pending' | 'safe' | 'finalized'> {
  name = 'BlockTag';
  
  isValid(value: unknown): value is 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized' {
    return typeof value === 'string' && 
           ['latest', 'earliest', 'pending', 'safe', 'finalized'].includes(value as any);
  }
}

/**
 * Block number type
 * Represents a non-negative bigint block number
 */
export class TBlockNumber extends Type<bigint> {
  name = 'BlockNumber';
  
  isValid(value: unknown): value is bigint {
    return typeof value === 'bigint' && value >= 0n;
  }
}

/**
 * Boolean type
 */
export class TBoolean extends Type<boolean> {
  name = 'Boolean';
  
  isValid(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }
}

/**
 * String type
 */
export class TString extends Type<string> {
  name = 'String';
  
  isValid(value: unknown): value is string {
    return typeof value === 'string';
  }
}

/**
 * Null type
 */
export class TNull extends Type<null> {
  name = 'Null';
  
  isValid(value: unknown): value is null {
    return value === null;
  }
}
