import * as fc from 'fast-check';
import { isAddress, isHex } from 'viem';
import {
  addressArbitrary,
  blockTagArbitrary,
  blockNumberArbitrary,
  hashArbitrary,
  valueArbitrary,
  gasArbitrary,
  gasPriceArbitrary,
  transactionArbitrary,
  transaction1559Arbitrary,
  hexDataArbitrary,
  topicArbitrary,
  topicsArbitrary,
  filterArbitrary
} from '../../src/testing/property/arbitraries';

describe('Ethereum Arbitraries', () => {
  describe('addressArbitrary', () => {
    it('generates valid Ethereum addresses', () => {
      const samples = fc.sample(addressArbitrary, 20);
      
      for (const address of samples) {
        expect(address.startsWith('0x')).toBe(true);
        expect(isAddress(address)).toBe(true);
        expect(address.length).toBe(42); // 0x + 40 hex chars
      }
    });
  });

  describe('blockTagArbitrary', () => {
    it('generates valid block tags', () => {
      const validTags = ['latest', 'earliest', 'pending', 'safe', 'finalized'];
      const samples = fc.sample(blockTagArbitrary, 20);
      
      for (const tag of samples) {
        expect(validTags).toContain(tag);
      }
    });
  });

  describe('blockNumberArbitrary', () => {
    it('generates valid block numbers', () => {
      const samples = fc.sample(blockNumberArbitrary, 20);
      
      for (const blockNumber of samples) {
        expect(typeof blockNumber).toBe('bigint');
        expect(blockNumber >= 0n).toBe(true);
      }
    });
  });

  describe('hashArbitrary', () => {
    it('generates valid transaction hashes', () => {
      const samples = fc.sample(hashArbitrary, 20);
      
      for (const hash of samples) {
        expect(hash.startsWith('0x')).toBe(true);
        expect(hash.length).toBe(66); // 0x + 64 hex chars
        expect(isHex(hash)).toBe(true);
      }
    });
  });

  describe('valueArbitrary', () => {
    it('generates valid Ethereum values', () => {
      const samples = fc.sample(valueArbitrary, 20);
      
      for (const value of samples) {
        expect(typeof value).toBe('bigint');
      }
    });
  });

  describe('gasArbitrary', () => {
    it('generates valid gas limits', () => {
      const validGasLimits = [21000n, 100000n, 200000n, 500000n, 1000000n];
      const samples = fc.sample(gasArbitrary, 20);
      
      for (const gas of samples) {
        expect(typeof gas).toBe('bigint');
        expect(validGasLimits).toContain(gas);
      }
    });
  });

  describe('gasPriceArbitrary', () => {
    it('generates valid gas prices', () => {
      const samples = fc.sample(gasPriceArbitrary, 20);
      
      for (const gasPrice of samples) {
        expect(typeof gasPrice).toBe('bigint');
        expect(gasPrice % 1000000000n).toBe(0n); // Should be in wei (gwei * 10^9)
      }
    });
  });

  describe('transactionArbitrary', () => {
    it('generates valid transaction objects', () => {
      const samples = fc.sample(transactionArbitrary, 20);
      
      for (const tx of samples) {
        expect(isAddress(tx.from)).toBe(true);
        expect(isAddress(tx.to)).toBe(true);
        expect(typeof tx.value).toBe('bigint');
        expect(typeof tx.gas).toBe('bigint');
        expect(typeof tx.gasPrice).toBe('bigint');
        expect(typeof tx.nonce).toBe('bigint');
      }
    });
  });

  describe('transaction1559Arbitrary', () => {
    it('generates valid EIP-1559 transaction objects', () => {
      const samples = fc.sample(transaction1559Arbitrary, 20);
      
      for (const tx of samples) {
        expect(isAddress(tx.from)).toBe(true);
        expect(isAddress(tx.to)).toBe(true);
        expect(typeof tx.value).toBe('bigint');
        expect(typeof tx.gas).toBe('bigint');
        expect(typeof tx.maxFeePerGas).toBe('bigint');
        expect(typeof tx.maxPriorityFeePerGas).toBe('bigint');
        expect(typeof tx.nonce).toBe('bigint');
      }
    });
  });

  describe('hexDataArbitrary', () => {
    it('generates valid hex data', () => {
      const samples = fc.sample(hexDataArbitrary, 20);
      
      for (const data of samples) {
        expect(data.startsWith('0x')).toBe(true);
        expect(isHex(data)).toBe(true);
        expect(data.length % 2).toBe(0); // Even length (hex bytes)
      }
    });
  });

  describe('topicArbitrary', () => {
    it('generates valid topics', () => {
      const samples = fc.sample(topicArbitrary, 20);
      
      for (const topic of samples) {
        if (topic === null) {
          expect(topic).toBeNull();
        } else {
          expect(topic?.startsWith('0x')).toBe(true);
          expect(topic?.length).toBe(66); // 0x + 64 hex chars
          expect(topic !== null && isHex(topic)).toBe(true);
        }
      }
    });
  });

  describe('topicsArbitrary', () => {
    it('generates valid arrays of topics', () => {
      const samples = fc.sample(topicsArbitrary, 20);
      
      for (const topics of samples) {
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBeLessThanOrEqual(4);
        
        for (const topic of topics) {
          if (topic === null) {
            expect(topic).toBeNull();
          } else {
            expect(topic?.startsWith('0x')).toBe(true);
            expect(topic?.length).toBe(66); // 0x + 64 hex chars
            expect(topic !== null && isHex(topic)).toBe(true);
          }
        }
      }
    });
  });

  describe('filterArbitrary', () => {
    it('generates valid filter objects', () => {
      const samples = fc.sample(filterArbitrary, 20);
      
      for (const filter of samples) {
        // Check fromBlock
        if (typeof filter.fromBlock === 'bigint') {
          expect(filter.fromBlock >= 0n).toBe(true);
        } else {
          const validTags = ['latest', 'earliest', 'pending', 'safe', 'finalized'];
          expect(validTags).toContain(filter.fromBlock);
        }
        
        // Check toBlock
        if (typeof filter.toBlock === 'bigint') {
          expect(filter.toBlock >= 0n).toBe(true);
        } else {
          const validTags = ['latest', 'earliest', 'pending', 'safe', 'finalized'];
          expect(validTags).toContain(filter.toBlock);
        }
        
        // Check address (optional)
        if (filter.address !== undefined && filter.address !== null) {
          expect(isAddress(filter.address)).toBe(true);
        }
        
        // Check topics (optional)
        if (filter.topics !== undefined && filter.topics !== null) {
          expect(Array.isArray(filter.topics)).toBe(true);
          expect(filter.topics.length).toBeLessThanOrEqual(4);
        }
      }
    });
  });
});
