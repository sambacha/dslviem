/**
 * Basic usage example for the Ethereum DSL TypeScript library
 * 
 * This example demonstrates how to use the library to test Ethereum applications
 * with property-based testing and mutation testing.
 */

import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { 
  TAddress, 
  PAddress, 
  EthereumTester,
  AddressMutator
} from '../src';

// Create a viem client
const client = createPublicClient({
  chain: mainnet,
  transport: http('https://eth-mainnet.g.alchemy.com/v2/your-api-key')
});

// Define some example addresses
const addresses: `0x${string}`[] = [
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'  // WBTC
];

async function main() {
  console.log('Running Ethereum DSL TypeScript library examples...');
  
  // Create a property for addresses
  const addressProperty = new PAddress(addresses);
  
  // 1. Property-based testing example
  console.log('\n1. Property-based testing example:');
  
  const propertyResult = await EthereumTester.propertyTest(
    addressProperty,
    async (address) => {
      try {
        // Test that getBalance returns a valid bigint for any address
        const balance = await client.getBalance({ address });
        console.log(`Balance of ${address}: ${balance}`);
        return typeof balance === 'bigint' && balance >= 0n;
      } catch (error) {
        console.error(`Error getting balance for ${address}:`, error);
        return false;
      }
    },
    { numRuns: 3, verbose: true }
  );
  
  console.log('Property test result:', propertyResult);
  
  // 2. Mutation testing example
  console.log('\n2. Mutation testing example:');
  
  const addressType = new TAddress();
  const sampleAddress = addresses[0];
  
  const mutationResult = await EthereumTester.mutationTest(
    sampleAddress,
    addressType,
    async (address) => {
      try {
        // Test that getBalance handles invalid addresses correctly
        const balance = await client.getBalance({ address });
        console.log(`Balance of ${address}: ${balance}`);
        return typeof balance === 'bigint' && balance >= 0n;
      } catch (error) {
        console.error(`Error getting balance for ${address}:`, error);
        return false;
      }
    },
    { verbose: true }
  );
  
  console.log('Mutation test result summary:', mutationResult.summary);
  
  // 3. Combined testing example
  console.log('\n3. Combined testing example:');
  
  const combinedResult = await EthereumTester.combinedTest(
    addressProperty,
    addressType,
    async (address) => {
      try {
        // Test that getBalance returns a valid bigint for any address
        const balance = await client.getBalance({ address });
        return typeof balance === 'bigint' && balance >= 0n;
      } catch (error) {
        return false;
      }
    },
    {
      property: { numRuns: 2 },
      mutation: { verbose: true }
    }
  );
  
  console.log('Combined test results:');
  console.log('- Property test:', combinedResult.propertyResult.success ? 'Passed' : 'Failed');
  console.log('- Mutation test:', combinedResult.mutationResults[0].summary);
  
  // 4. Manual mutation example
  console.log('\n4. Manual mutation example:');
  
  const addressMutator = new AddressMutator();
  const mutations = addressMutator.mutate(sampleAddress);
  
  console.log(`Original address: ${sampleAddress}`);
  console.log(`Mutations: ${mutations.join(', ')}`);
  
  // Test each mutation
  for (const mutation of mutations) {
    try {
      const balance = await client.getBalance({ address: mutation });
      console.log(`Balance of ${mutation}: ${balance}`);
    } catch (error) {
      console.error(`Error getting balance for ${mutation}:`, error);
    }
  }
}

// Run the examples
main().catch(console.error);
