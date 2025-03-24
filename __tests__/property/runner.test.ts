import { PropertyTestRunner, PropertyTestOptions } from '../../src/testing/property/runner';
import { Property } from '../../src/properties/base';

describe('PropertyTestRunner', () => {
  describe('test', () => {
    it('returns success for a passing test', async () => {
      // Create a simple property that always generates the value 42
      const property: Property<number> = {
        name: 'AlwaysFortyTwo',
        generate: () => 42
      };
      
      // Create a predicate that always returns true
      const predicate = (value: number) => value === 42;
      
      // Run the test
      const result = await PropertyTestRunner.test(property, predicate);
      
      // Verify the result
      expect(result.success).toBe(true);
      expect(result.numRuns).toBeDefined();
      expect(result.seed).toBeDefined();
      expect(result.counterexample).toBeUndefined();
      expect(result.error).toBeUndefined();
    });
    
    it('returns failure for a failing test', async () => {
      // Create a simple property that always generates the value 42
      const property: Property<number> = {
        name: 'AlwaysFortyTwo',
        generate: () => 42
      };
      
      // Create a predicate that always returns false
      const predicate = (value: number) => value === 100;
      
      // Run the test
      const result = await PropertyTestRunner.test(property, predicate);
      
      // Verify the result
      expect(result.success).toBe(false);
      expect(result.numRuns).toBeDefined();
      expect(result.seed).toBeDefined();
      expect(result.counterexample).toBe(42);
      expect(result.error).toBeUndefined();
    });
    
    it('handles errors during testing', async () => {
      // Create a simple property that always generates the value 42
      const property: Property<number> = {
        name: 'AlwaysFortyTwo',
        generate: () => 42
      };
      
      // Create a predicate that throws an error
      const predicate = (value: number) => {
        throw new Error('Test error');
      };
      
      // Run the test
      const result = await PropertyTestRunner.test(property, predicate);
      
      // Verify the result
      expect(result.success).toBe(false);
      expect(result.numRuns).toBeDefined();
      expect(result.seed).toBeDefined();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Test error');
    });
    
    it('respects the numRuns option', async () => {
      // Create a property that generates sequential numbers
      let counter = 0;
      const property: Property<number> = {
        name: 'SequentialNumbers',
        generate: () => counter++
      };
      
      // Create a predicate that always returns true
      const predicate = () => true;
      
      // Run the test with custom numRuns
      const options: PropertyTestOptions = { numRuns: 5 };
      const result = await PropertyTestRunner.test(property, predicate, options);
      
      // Verify the result
      expect(result.success).toBe(true);
      expect(result.numRuns).toBe(5);
      expect(counter).toBeLessThanOrEqual(5); // May be less due to the implementation simplification
    });
    
    it('handles async predicates', async () => {
      // Create a simple property that always generates the value 42
      const property: Property<number> = {
        name: 'AlwaysFortyTwo',
        generate: () => 42
      };
      
      // Create an async predicate that returns true
      const predicate = async (value: number): Promise<boolean> => {
        return new Promise<boolean>(resolve => {
          setTimeout(() => resolve(value === 42), 10);
        });
      };
      
      // Run the test
      const result = await PropertyTestRunner.test(property, predicate);
      
      // Verify the result
      expect(result.success).toBe(true);
    });
  });
  
  describe('testAll', () => {
    it('runs multiple tests', async () => {
      // Create two simple properties
      const property1: Property<number> = {
        name: 'AlwaysFortyTwo',
        generate: () => 42
      };
      
      const property2: Property<string> = {
        name: 'AlwaysHello',
        generate: () => 'hello'
      };
      
      // Create the test suite
      const tests = [
        {
          name: 'Test1',
          property: property1,
          predicate: (value: number) => value === 42
        },
        {
          name: 'Test2',
          property: property2,
          predicate: (value: string) => value === 'hello'
        }
      ];
      
      // Run all tests
      const results = await PropertyTestRunner.testAll(tests);
      
      // Verify results
      expect(results).toHaveProperty('Test1');
      expect(results).toHaveProperty('Test2');
      expect(results.Test1.success).toBe(true);
      expect(results.Test2.success).toBe(true);
    });
    
    it('handles mixed success and failure', async () => {
      // Create two simple properties
      const property1: Property<number> = {
        name: 'AlwaysFortyTwo',
        generate: () => 42
      };
      
      const property2: Property<string> = {
        name: 'AlwaysHello',
        generate: () => 'hello'
      };
      
      // Create the test suite with one passing and one failing test
      const tests = [
        {
          name: 'PassingTest',
          property: property1,
          predicate: (value: number) => value === 42
        },
        {
          name: 'FailingTest',
          property: property2,
          predicate: (value: string) => value === 'world'
        }
      ];
      
      // Run all tests
      const results = await PropertyTestRunner.testAll(tests);
      
      // Verify results
      expect(results.PassingTest.success).toBe(true);
      expect(results.FailingTest.success).toBe(false);
      expect(results.FailingTest.counterexample).toBe('hello');
    });
  });
});
