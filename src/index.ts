/**
 * Ethereum DSL TypeScript Library
 * 
 * A domain-specific language for testing Ethereum applications
 * with property-based testing and mutation testing capabilities.
 */

// Export all components
export * from './types';
export * from './properties';
export * from './testing';

// Export a default object for convenience
import { EthereumTester } from './testing';

/**
 * Main entry point for the library
 */
export default {
  /**
   * Testing utilities
   */
  testing: EthereumTester
};
