import * as fc from 'fast-check';
import { isAddress, isHex, parseEther } from 'viem';

/**
 * Arbitrary for Ethereum addresses
 * Generates valid Ethereum addresses (0x followed by 40 hex characters)
 */
export const addressArbitrary = fc.stringMatching(/^[0-9a-f]{40}$/)
  .map(h => `0x${h}` as `0x${string}`)
  .filter(addr => isAddress(addr));

/**
 * Arbitrary for block tags
 * Generates valid block tags like 'latest', 'earliest', etc.
 */
export const blockTagArbitrary = fc.oneof(
  fc.constant('latest'),
  fc.constant('earliest'),
  fc.constant('pending'),
  fc.constant('safe'),
  fc.constant('finalized')
) as fc.Arbitrary<'latest' | 'earliest' | 'pending' | 'safe' | 'finalized'>;

/**
 * Arbitrary for block numbers
 * Generates valid block numbers as bigints
 */
export const blockNumberArbitrary = fc.bigInt({ min: 0n, max: 2n ** 64n - 1n });

/**
 * Arbitrary for transaction hashes
 * Generates valid transaction hashes (0x followed by 64 hex characters)
 */
export const hashArbitrary = fc.stringMatching(/^[0-9a-f]{64}$/)
  .map(h => `0x${h}` as `0x${string}`)
  .filter(hash => isHex(hash) && hash.length === 66);

/**
 * Arbitrary for Ethereum values
 * Generates valid Ethereum values in wei
 */
export const valueArbitrary = fc.oneof(
  fc.constant(0n),
  fc.nat().map(n => parseEther(n.toString().slice(0, 4) + '.' + n.toString().slice(4, 6)))
);

/**
 * Arbitrary for gas limits
 * Generates valid gas limits
 */
export const gasArbitrary = fc.oneof(
  fc.constant(21000n), // Basic transaction
  fc.constant(100000n), // Simple contract call
  fc.constant(200000n), // Complex contract call
  fc.constant(500000n), // Contract deployment
  fc.constant(1000000n) // Large contract deployment
);

/**
 * Arbitrary for gas prices
 * Generates valid gas prices in wei
 */
export const gasPriceArbitrary = fc.nat(1000)
  .map(n => BigInt(n) * 1000000000n); // Convert to wei (gwei * 10^9)

/**
 * Arbitrary for transaction objects
 * Generates valid transaction objects
 */
export const transactionArbitrary = fc.record({
  from: addressArbitrary,
  to: addressArbitrary,
  value: valueArbitrary,
  gas: gasArbitrary,
  gasPrice: gasPriceArbitrary,
  nonce: fc.nat(1000).map(BigInt)
});

/**
 * Arbitrary for EIP-1559 transaction objects
 * Generates valid EIP-1559 transaction objects
 */
export const transaction1559Arbitrary = fc.record({
  from: addressArbitrary,
  to: addressArbitrary,
  value: valueArbitrary,
  gas: gasArbitrary,
  maxFeePerGas: gasPriceArbitrary,
  maxPriorityFeePerGas: gasPriceArbitrary,
  nonce: fc.nat(1000).map(BigInt)
});

/**
 * Arbitrary for hex data
 * Generates valid hex data (0x followed by an even number of hex characters)
 */
export const hexDataArbitrary = fc.stringMatching(/^[0-9a-f]*$/)
  .map(h => h.length % 2 === 0 ? `0x${h}` : `0x${h}0` as `0x${string}`);

/**
 * Arbitrary for topics
 * Generates valid topics for event logs
 */
export const topicArbitrary = fc.oneof(
  hashArbitrary,
  fc.constant(null)
);

/**
 * Arbitrary for arrays of topics
 * Generates valid arrays of topics for event logs
 */
export const topicsArbitrary = fc.array(topicArbitrary, { maxLength: 4 });

/**
 * Arbitrary for filter objects
 * Generates valid filter objects for getPastLogs
 */
export const filterArbitrary = fc.record({
  fromBlock: fc.oneof(blockNumberArbitrary, blockTagArbitrary),
  toBlock: fc.oneof(blockNumberArbitrary, blockTagArbitrary),
  address: fc.option(addressArbitrary),
  topics: fc.option(topicsArbitrary)
});
