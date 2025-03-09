import { BaseProperty } from './base';
import { parseEther } from 'viem';

/**
 * Address property
 * Generates Ethereum addresses from a predefined list
 */
export class PAddress extends BaseProperty<`0x${string}`> {
  name = '<Address>';
  private addresses: `0x${string}`[];
  
  constructor(addresses: `0x${string}`[]) {
    super();
    this.addresses = addresses;
  }
  
  generate(): `0x${string}` {
    return this.addresses[Math.floor(Math.random() * this.addresses.length)];
  }
}

/**
 * Block tag property
 * Generates block tags like 'latest', 'earliest', etc.
 */
export class PBlockTag extends BaseProperty<'latest' | 'earliest' | 'pending' | 'safe' | 'finalized'> {
  name = '<BlockTag>';
  
  generate(): 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized' {
    const tags: ('latest' | 'earliest' | 'pending' | 'safe' | 'finalized')[] = 
      ['latest', 'earliest', 'pending', 'safe', 'finalized'];
    return tags[Math.floor(Math.random() * tags.length)];
  }
}

/**
 * Value property
 * Generates Ethereum values (in wei)
 */
export class PValue extends BaseProperty<bigint> {
  name = '<Value>';
  
  generate(): bigint {
    // Generate random Ether values
    const values = [
      '0.01', '0.1', '1', '10', '100'
    ];
    const value = values[Math.floor(Math.random() * values.length)];
    return parseEther(value);
  }
}

/**
 * Gas property
 * Generates gas limits
 */
export class PGas extends BaseProperty<bigint> {
  name = '<Gas>';
  
  generate(): bigint {
    const values = [
      21000n, // Basic transaction
      100000n, // Simple contract call
      200000n, // Complex contract call
      500000n, // Contract deployment
      1000000n // Large contract deployment
    ];
    return values[Math.floor(Math.random() * values.length)];
  }
}

/**
 * Gas price property
 * Generates gas prices (in wei)
 */
export class PGasPrice extends BaseProperty<bigint> {
  name = '<GasPrice>';
  
  generate(): bigint {
    // Generate random gas prices (in gwei, converted to wei)
    const gweiValues = [
      1n, 5n, 10n, 20n, 50n, 100n
    ];
    return gweiValues[Math.floor(Math.random() * gweiValues.length)] * 1000000000n;
  }
}

/**
 * Boolean property
 * Generates random boolean values
 */
export class PBoolean extends BaseProperty<boolean> {
  name = '<Boolean>';
  
  generate(): boolean {
    return Math.random() > 0.5;
  }
}

/**
 * Null property
 * Always generates null
 */
export class PNull extends BaseProperty<null> {
  name = '<Null>';
  
  generate(): null {
    return null;
  }
}

/**
 * Range property
 * Generates a number within a specified range
 */
export class PRange extends BaseProperty<number> {
  name: string;
  private min: number;
  private max: number;
  
  constructor(min: number, max: number) {
    super();
    this.min = min;
    this.max = max;
    this.name = `<Range(${min},${max})>`;
  }
  
  generate(): number {
    return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
  }
}

/**
 * Constant property
 * Always generates the same value
 */
export class PConst<T> extends BaseProperty<T> {
  name: string;
  private value: T;
  
  constructor(value: T) {
    super();
    this.value = value;
    this.name = `<Const(${String(value)})>`;
  }
  
  generate(): T {
    return this.value;
  }
}

/**
 * Storage index property
 * Generates storage slot indices for a contract
 */
export class PStorageIdx extends BaseProperty<`0x${string}`> {
  name = '<StorageIdx>';
  private slots: string[];
  
  constructor(slots: string[]) {
    super();
    this.slots = slots;
  }
  
  generate(): `0x${string}` {
    const slot = this.slots[Math.floor(Math.random() * this.slots.length)];
    // Ensure the slot is properly formatted as a 32-byte hex string
    return `0x${slot.replace(/^0x/, '').padStart(64, '0')}` as `0x${string}`;
  }
}
