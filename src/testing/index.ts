// Export all testing components
export * from './property';
export * from './mutation';

// Re-export commonly used components for convenience
import { PropertyTestRunner, PropertyTestOptions, PropertyTestResult } from './property/runner';
import { MutationTestResult, MutationTestOptions } from './mutation/base';
import { MutationTestRunner } from './mutation/runner';
import { createDefaultRegistry } from './mutation/registry';
import { createDefaultRunner } from './mutation/runner';
import { Property } from '../properties/base';
import { BaseType } from '../types/base';

/**
 * Main testing API
 * Provides a unified interface for property and mutation testing
 */
export class EthereumTester {
  /**
   * Run a property test
   * 
   * @param property The property to test
   * @param predicate The predicate to test against
   * @param options Options for the test
   * @returns The result of the test
   */
  static async propertyTest<T>(
    property: Property<T>,
    predicate: (value: T) => boolean | Promise<boolean>,
    options?: PropertyTestOptions
  ): Promise<PropertyTestResult> {
    return PropertyTestRunner.test(property, predicate, options);
  }
  
  /**
   * Run a mutation test
   * 
   * @param value The value to test
   * @param type The type of the value
   * @param validator A function that validates the value
   * @param options Options for the test
   * @returns The result of the test
   */
  static async mutationTest<T>(
    value: T,
    type: BaseType<T>,
    validator: (value: T) => boolean | Promise<boolean>,
    options?: MutationTestOptions
  ): Promise<MutationTestResult> {
    const runner = createDefaultRunner();
    return runner.test(value, type, validator, options);
  }
  
  /**
   * Run both property and mutation tests
   * 
   * @param property The property to test
   * @param type The type of the property's values
   * @param validator A function that validates values
   * @param options Options for the tests
   * @returns The results of both tests
   */
  static async combinedTest<T>(
    property: Property<T>,
    type: BaseType<T>,
    validator: (value: T) => boolean | Promise<boolean>,
    options?: {
      property?: PropertyTestOptions;
      mutation?: MutationTestOptions;
    }
  ): Promise<{
    propertyResult: PropertyTestResult;
    mutationResults: MutationTestResult[];
  }> {
    // First run property tests
    const propertyResult = await PropertyTestRunner.test(
      property, 
      validator,
      options?.property
    );
    
    // Then run mutation tests on a sample value
    const sampleValue = await property.generate();
    const mutationRunner = createDefaultRunner();
    const mutationResult = await mutationRunner.test(
      sampleValue,
      type,
      validator,
      options?.mutation
    );
    
    return {
      propertyResult,
      mutationResults: [mutationResult]
    };
  }
}
