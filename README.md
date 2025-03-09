# Ethereum DSL TypeScript Library

A domain-specific language for testing Ethereum applications with property-based testing and mutation testing capabilities.

## Overview

This library provides a TypeScript implementation of a domain-specific language (DSL) for testing Ethereum applications. It includes:

- A type system for Ethereum-specific data types
- Property generators for creating test values
- Property-based testing using fast-check
- Mutation testing for finding edge cases
- Integration with viem for Ethereum interactions

## Installation

```bash
npm install ethereum-dsl-ts
```

## Usage

### Basic Example

```typescript
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { TAddress, PAddress, EthereumTester } from 'ethereum-dsl-ts';

// Create a viem client
const client = createPublicClient({
  chain: mainnet,
  transport: http('https://ethereum-rpc-url')
});

// Define some example addresses
const addresses = [
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  '0x6B175474E89094C44Da98b954EedeAC495271d0F'  // DAI
];

// Create a property for addresses
const addressProperty = new PAddress(addresses);

// Run a property test
const result = await EthereumTester.propertyTest(
  addressProperty,
  async (address) => {
    try {
      // Test that getBalance returns a valid bigint for any address
      const balance = await client.getBalance({ address });
      return typeof balance === 'bigint' && balance >= 0n;
    } catch (error) {
      return false;
    }
  },
  { numRuns: 10 }
);

console.log('Property test result:', result);
```

### Property-Based Testing

Property-based testing generates multiple test cases from properties and checks if they satisfy certain conditions.

```typescript
import { PBlockTag, EthereumTester } from 'ethereum-dsl-ts';

// Create a property for block tags
const blockTagProperty = new PBlockTag();

// Run a property test
const result = await EthereumTester.propertyTest(
  blockTagProperty,
  async (blockTag) => {
    try {
      // Test that getBlock returns a valid block for any block tag
      const block = await client.getBlock({ blockTag });
      return block !== null;
    } catch (error) {
      return false;
    }
  }
);
```

### Mutation Testing

Mutation testing generates variations of valid inputs to test how well your code handles edge cases.

```typescript
import { TAddress, EthereumTester } from 'ethereum-dsl-ts';

// Run a mutation test
const result = await EthereumTester.mutationTest(
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  new TAddress(),
  async (address) => {
    try {
      // Test that getBalance handles invalid addresses correctly
      const balance = await client.getBalance({ address });
      return typeof balance === 'bigint';
    } catch (error) {
      // We expect errors for invalid addresses
      return false;
    }
  }
);

console.log('Mutation test result:', result.summary);
```

### Combined Testing

You can also run both property-based testing and mutation testing together.

```typescript
import { TAddress, PAddress, EthereumTester } from 'ethereum-dsl-ts';

// Run combined tests
const result = await EthereumTester.combinedTest(
  new PAddress(addresses),
  new TAddress(),
  async (address) => {
    try {
      const balance = await client.getBalance({ address });
      return typeof balance === 'bigint';
    } catch (error) {
      return false;
    }
  }
);

console.log('Combined test results:', result);
```

## API Reference

### Types

- `TAddress` - Ethereum address type
- `THex` - Hexadecimal string type
- `THex32` - 32-byte hash type
- `TBlockTag` - Block tag type
- `TBlockNumber` - Block number type
- `TBlock` - Block object type
- `TTransaction` - Transaction object type
- `TTransactionReceipt` - Transaction receipt type
- `TLog` - Log object type

### Properties

- `PAddress` - Generates Ethereum addresses
- `PBlockTag` - Generates block tags
- `PBlockNumber` - Generates block numbers
- `PValue` - Generates Ethereum values
- `PGas` - Generates gas limits
- `PGasPrice` - Generates gas prices
- `PTxHash` - Generates transaction hashes
- `PBlockHash` - Generates block hashes

### Testing

- `EthereumTester.propertyTest()` - Run property-based tests
- `EthereumTester.mutationTest()` - Run mutation tests
- `EthereumTester.combinedTest()` - Run both property and mutation tests

## License

MIT
