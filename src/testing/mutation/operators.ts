import { BaseTypedMutationOperator } from './base';
import { TAddress, TBlockTag, TBlockNumber, THex32 } from '../../types/primitive';

/**
 * Mutation operator for Ethereum addresses
 * Generates invalid variations of addresses
 */
export class AddressMutator extends BaseTypedMutationOperator<`0x${string}`> {
  name = 'AddressMutator';
  type = new TAddress();
  
  mutate(address: `0x${string}`): `0x${string}`[] {
    return [
      // Change checksum
      address.toLowerCase() as `0x${string}`,
      
      // Invalid length (not a valid address but has 0x prefix)
      (address.substring(0, 41) + '0') as `0x${string}`,
      
      // Invalid prefix
      ('0X' + address.substring(2)) as `0x${string}`,
      
      // Zero address
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
      
      // Replace a character
      (address.substring(0, 10) + 'X' + address.substring(11)) as `0x${string}`
    ];
  }
}

/**
 * Mutation operator for block tags
 * Generates invalid variations of block tags
 */
export class BlockTagMutator extends BaseTypedMutationOperator<'latest' | 'earliest' | 'pending' | 'safe' | 'finalized'> {
  name = 'BlockTagMutator';
  type = new TBlockTag();
  
  mutate(blockTag: 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized'): ('latest' | 'earliest' | 'pending' | 'safe' | 'finalized')[] {
    // Return all other valid block tags
    const allTags: ('latest' | 'earliest' | 'pending' | 'safe' | 'finalized')[] = 
      ['latest', 'earliest', 'pending', 'safe', 'finalized'];
    
    return allTags.filter(tag => tag !== blockTag);
  }
}

/**
 * Mutation operator for block numbers
 * Generates invalid variations of block numbers
 */
export class BlockNumberMutator extends BaseTypedMutationOperator<bigint> {
  name = 'BlockNumberMutator';
  type = new TBlockNumber();
  
  mutate(blockNumber: bigint): bigint[] {
    return [
      // Boundary values
      0n,
      1n,
      blockNumber + 1n,
      blockNumber - 1n,
      
      // Very large number
      2n ** 64n - 1n,
      
      // Negative number (invalid for block numbers)
      -1n
    ];
  }
}

/**
 * Mutation operator for transaction hashes
 * Generates invalid variations of transaction hashes
 */
export class HashMutator extends BaseTypedMutationOperator<`0x${string}`> {
  name = 'HashMutator';
  type = new THex32();
  
  mutate(hash: `0x${string}`): `0x${string}`[] {
    return [
      // Change a character
      (hash.substring(0, 10) + 'X' + hash.substring(11)) as `0x${string}`,
      
      // Invalid prefix
      ('0X' + hash.substring(2)) as `0x${string}`,
      
      // Zero hash
      '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
      
      // Invalid length (too short)
      (hash.substring(0, 65)) as `0x${string}`,
      
      // Invalid length (too long)
      (hash + '0') as `0x${string}`
    ];
  }
}

/**
 * Mutation operator for boolean values
 * Simply inverts the boolean
 */
export class BooleanMutator extends BaseTypedMutationOperator<boolean> {
  name = 'BooleanMutator';
  type = { 
    name: 'Boolean',
    isValid: (value: unknown): value is boolean => typeof value === 'boolean',
    mutable: () => true,
    unrollValue: (value: boolean) => ({ rv: value })
  };
  
  mutate(value: boolean): boolean[] {
    return [!value];
  }
}

/**
 * Mutation operator for numbers
 * Generates variations of numbers
 */
export class NumberMutator extends BaseTypedMutationOperator<number> {
  name = 'NumberMutator';
  type = { 
    name: 'Number',
    isValid: (value: unknown): value is number => typeof value === 'number',
    mutable: () => true,
    unrollValue: (value: number) => ({ rv: value })
  };
  
  mutate(value: number): number[] {
    return [
      0,
      value + 1,
      value - 1,
      -value,
      value * 2,
      Math.floor(value / 2),
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER
    ];
  }
}

/**
 * Mutation operator for strings
 * Generates variations of strings
 */
export class StringMutator extends BaseTypedMutationOperator<string> {
  name = 'StringMutator';
  type = { 
    name: 'String',
    isValid: (value: unknown): value is string => typeof value === 'string',
    mutable: () => true,
    unrollValue: (value: string) => ({ rv: value })
  };
  
  mutate(value: string): string[] {
    return [
      '', // Empty string
      value + 'X', // Append a character
      value.substring(0, value.length - 1), // Remove last character
      value.toUpperCase(), // Change case
      value.toLowerCase(), // Change case
      value.split('').reverse().join('') // Reverse
    ];
  }
}

/**
 * Mutation operator for arrays
 * Generates variations of arrays
 */
export class ArrayMutator<T> extends BaseTypedMutationOperator<T[]> {
  name = 'ArrayMutator';
  type = { 
    name: 'Array',
    isValid: (value: unknown): value is T[] => Array.isArray(value),
    mutable: () => true,
    unrollValue: (value: T[]) => ({ rv: value })
  };
  
  mutate(value: T[]): T[][] {
    if (value.length === 0) {
      // For empty arrays, add an element
      return [
        [null as unknown as T]
      ];
    }
    
    return [
      [], // Empty array
      value.slice(1), // Remove first element
      value.slice(0, -1), // Remove last element
      [...value, value[0]], // Add duplicate of first element
      value.slice().reverse(), // Reverse
      [value[0]] // Just first element
    ];
  }
}
