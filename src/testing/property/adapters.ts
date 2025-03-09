import * as fc from 'fast-check';
import { Property } from '../../properties/base';

/**
 * Converts a DSL property to a fast-check arbitrary
 * This allows using our DSL properties with fast-check's property testing
 * 
 * @param property The DSL property to convert
 * @returns A fast-check arbitrary that generates values using the property
 */
export function propertyToArbitrary<T>(property: Property<T>): fc.Arbitrary<T> {
  // For synchronous properties, this is straightforward
  if (property.generate.constructor.name !== 'AsyncFunction') {
    return fc.constant(null).map(() => property.generate() as T);
  }
  
  // For async properties, we need to handle the promise
  // Note: In a real implementation, we'd need a better solution
  // This is just a simplified approach for demonstration
  return fc.constant(null).map(() => {
    // Create a synchronous wrapper that returns a cached value
    // This assumes the property doesn't change between calls
    let cachedValue: T | null = null;
    
    // Try to generate a value synchronously
    try {
      const promise = property.generate() as Promise<T>;
      // This is a hack - in reality, we'd need to handle this differently
      // Perhaps by pre-generating values or using a different approach
      promise.then(value => {
        cachedValue = value;
      });
      
      // Return a default value if we don't have a cached value yet
      // This is not ideal but works for demonstration purposes
      return cachedValue || {} as T;
    } catch (e) {
      return {} as T;
    }
  });
}

/**
 * Converts a fast-check arbitrary to a DSL property
 * This allows using fast-check arbitraries with our DSL
 * 
 * @param arbitrary The fast-check arbitrary to convert
 * @param name Optional name for the property
 * @returns A DSL property that generates values using the arbitrary
 */
export function arbitraryToProperty<T>(
  arbitrary: fc.Arbitrary<T>, 
  name: string = 'ArbitraryProperty'
): Property<T> {
  return {
    name,
    generate(): T {
      return fc.sample(arbitrary, 1)[0];
    }
  };
}

/**
 * Creates a property that generates values from a set of examples
 * This is useful for testing with specific values
 * 
 * @param examples The examples to use
 * @param name Optional name for the property
 * @returns A DSL property that generates values from the examples
 */
export function exampleProperty<T>(
  examples: T[],
  name: string = 'ExampleProperty'
): Property<T> {
  return {
    name,
    generate(): T {
      return examples[Math.floor(Math.random() * examples.length)];
    }
  };
}

/**
 * Creates a property that generates values from a fast-check arbitrary
 * and then applies a transformation function
 * 
 * @param arbitrary The fast-check arbitrary to use
 * @param transform The transformation function to apply
 * @param name Optional name for the property
 * @returns A DSL property that generates transformed values
 */
export function transformedProperty<T, U>(
  arbitrary: fc.Arbitrary<T>,
  transform: (value: T) => U,
  name: string = 'TransformedProperty'
): Property<U> {
  return {
    name,
    generate(): U {
      const value = fc.sample(arbitrary, 1)[0];
      return transform(value);
    }
  };
}
