import { BaseType } from '../../types/base';
import { MutationRegistry } from './registry';
import { TypedMutationOperator, MutationTestResult, MutationResult, MutationTestOptions } from './base';

/**
 * Runner for mutation tests
 * Uses mutation operators to generate and test mutations
 */
export class MutationTestRunner {
  private registry: MutationRegistry;
  
  /**
   * Create a new mutation test runner
   * @param registry The mutation registry to use
   */
  constructor(registry: MutationRegistry) {
    this.registry = registry;
  }
  
  /**
   * Test a value with mutations
   * 
   * @param value The value to test
   * @param type The type of the value
   * @param validator A function that validates the value
   * @param options Options for the test
   * @returns The result of the test
   */
  async test<T>(
    value: T,
    type: BaseType<T>,
    validator: (value: T) => boolean | Promise<boolean>,
    options: MutationTestOptions = {}
  ): Promise<MutationTestResult> {
    const mutations = this.registry.mutate(value, type);
    const results: MutationResult[] = [];
    
    for (const mutation of mutations) {
      try {
        const isValid = await Promise.race([
          validator(mutation),
          new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), options.timeout || 5000)
          )
        ]);
        
        results.push({
          value: mutation,
          caught: !isValid
        });
      } catch (error) {
        results.push({
          value: mutation,
          caught: true,
          error: error as Error
        });
      }
    }
    
    return {
      originalValue: value,
      mutations: results,
      summary: {
        total: results.length,
        caught: results.filter(r => r.caught).length,
        uncaught: results.filter(r => !r.caught).length,
        errors: results.filter(r => r.error).length
      }
    };
  }
  
  /**
   * Test a value with a specific mutation operator
   * 
   * @param value The value to test
   * @param operator The mutation operator to use
   * @param validator A function that validates the value
   * @param options Options for the test
   * @returns The result of the test
   */
  async testWithOperator<T>(
    value: T,
    operator: TypedMutationOperator<T>,
    validator: (value: T) => boolean | Promise<boolean>,
    options: MutationTestOptions = {}
  ): Promise<MutationTestResult> {
    if (!operator.isApplicable(value)) {
      throw new Error(`Operator ${operator.name} is not applicable to value ${value}`);
    }
    
    const mutations = operator.mutate(value);
    const results: MutationResult[] = [];
    
    for (const mutation of mutations) {
      try {
        const isValid = await Promise.race([
          validator(mutation),
          new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), options.timeout || 5000)
          )
        ]);
        
        results.push({
          value: mutation,
          caught: !isValid
        });
      } catch (error) {
        results.push({
          value: mutation,
          caught: true,
          error: error as Error
        });
      }
    }
    
    return {
      originalValue: value,
      mutations: results,
      summary: {
        total: results.length,
        caught: results.filter(r => r.caught).length,
        uncaught: results.filter(r => !r.caught).length,
        errors: results.filter(r => r.error).length
      }
    };
  }
  
  /**
   * Test multiple values
   * 
   * @param tests An array of tests to run
   * @param options Options for the tests
   * @returns The results of the tests
   */
  async testAll(
    tests: Array<{
      name: string;
      value: any;
      type: BaseType<any>;
      validator: (value: any) => boolean | Promise<boolean>;
    }>,
    options: MutationTestOptions = {}
  ): Promise<Record<string, MutationTestResult>> {
    const results: Record<string, MutationTestResult> = {};
    
    for (const test of tests) {
      results[test.name] = await this.test(
        test.value,
        test.type,
        test.validator,
        options
      );
    }
    
    return results;
  }
}

/**
 * Create a default mutation test runner
 * @returns A new mutation test runner with default operators
 */
export function createDefaultRunner(): MutationTestRunner {
  return new MutationTestRunner(new MutationRegistry());
}
