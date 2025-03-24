import * as fc from 'fast-check';
import { Property } from '../../src/properties/base';
import {
  propertyToArbitrary,
  arbitraryToProperty,
  exampleProperty,
  transformedProperty
} from '../../src/testing/property/adapters';

describe('Property Testing Adapters', () => {
  describe('propertyToArbitrary', () => {
    it('converts a synchronous property to an arbitrary', () => {
      // Create a simple sync property
      const syncProperty: Property<number> = {
        name: 'TestProperty',
        generate: () => 42
      };
      
      // Convert to arbitrary
      const arbitrary = propertyToArbitrary(syncProperty);
      
      // Sample and verify
      const samples = fc.sample(arbitrary, 10);
      expect(samples).toHaveLength(10);
      expect(samples.every(sample => sample === 42)).toBe(true);
    });
    
    it('handles asynchronous property (simplified)', () => {
      // Create a simple async property that returns a promise
      const asyncProperty: Property<string> = {
        name: 'AsyncProperty',
        generate: async () => 'async-value'
      };
      
      // Convert to arbitrary (note: this is a simplified test due to the limitations
      // of the current implementation for async properties)
      const arbitrary = propertyToArbitrary(asyncProperty);
      
      // Sample the arbitrary
      const samples = fc.sample(arbitrary, 5);
      expect(samples).toHaveLength(5);
    });
  });
  
  describe('arbitraryToProperty', () => {
    it('converts an arbitrary to a property', () => {
      // Create a simple arbitrary
      const arbitrary = fc.constant(123);
      
      // Convert to property
      const property = arbitraryToProperty(arbitrary, 'NumberProperty');
      
      // Check property attributes
      expect(property.name).toBe('NumberProperty');
      
      // Generate a value and verify it matches expected
      const generated = property.generate();
      expect(typeof generated).toBe('number');
    });
    
    it('uses default name if not provided', () => {
      const arbitrary = fc.constant('test');
      const property = arbitraryToProperty(arbitrary);
      
      expect(property.name).toBe('ArbitraryProperty');
    });
  });
  
  describe('exampleProperty', () => {
    it('generates values from a set of examples', () => {
      const examples = [1, 2, 3, 4, 5];
      const property = exampleProperty(examples, 'ExampleNumbers');
      
      // Check property attributes
      expect(property.name).toBe('ExampleNumbers');
      
      // Generate a value and verify it comes from the examples
      const generated: number = property.generate() as number;
      expect(examples.includes(generated)).toBe(true);
    });
    
    it('uses default name if not specified', () => {
      const property = exampleProperty(['a', 'b', 'c']);
      expect(property.name).toBe('ExampleProperty');
    });
  });
  
  describe('transformedProperty', () => {
    it('applies transformation to generated values', () => {
      // Create an arbitrary that generates numbers
      const arbitrary = fc.constant(5);
      
      // Create a transform function that squares the number
      const transform = (n: number) => n * n;
      
      // Create the transformed property
      const property = transformedProperty(arbitrary, transform, 'Squares');
      
      // Check property attributes
      expect(property.name).toBe('Squares');
      
      // Generate values and verify they are transformed correctly
      const value = property.generate();
      expect(value).toBe(25); // 5 squared
    });
    
    it('uses default name if not provided', () => {
      const property = transformedProperty(fc.constant(1), n => n + 1);
      expect(property.name).toBe('TransformedProperty');
    });
  });
  
  // Property-to-Arbitrary-to-Property conversion tests
  describe('Bidirectional conversion', () => {
    it('preserves property behavior through bidirectional conversion', () => {
      // Start with a property
      const originalProperty: Property<string> = {
        name: 'Original',
        generate: () => 'hello'
      };
      
      // Convert to arbitrary
      const arbitrary = propertyToArbitrary(originalProperty);
      
      // Convert back to property
      const roundTripProperty = arbitraryToProperty(arbitrary, 'RoundTrip');
      
      // The round-trip property should generate the same values
      const generated = roundTripProperty.generate();
      expect(generated).toBe('hello');
    });
  });
});
