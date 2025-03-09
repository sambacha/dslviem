import { BaseType } from '../../types/base';

/**
 * Interface for mutation operators
 * Mutation operators generate variations of values
 */
export interface MutationOperator<T> {
  /** Name of the mutation operator */
  name: string;
  
  /** Generate mutations of a value */
  mutate(value: T): T[];
}

/**
 * Abstract base class for mutation operators
 */
export abstract class BaseMutationOperator<T> implements MutationOperator<T> {
  abstract name: string;
  abstract mutate(value: T): T[];
}

/**
 * Interface for type-specific mutation operators
 * These operators are tied to specific types and can validate if they apply
 */
export interface TypedMutationOperator<T> extends MutationOperator<T> {
  /** The type this operator works with */
  type: BaseType<T>;
  
  /** Check if this operator can be applied to a value */
  isApplicable(value: unknown): value is T;
}

/**
 * Abstract base class for type-specific mutation operators
 */
export abstract class BaseTypedMutationOperator<T> extends BaseMutationOperator<T> implements TypedMutationOperator<T> {
  abstract type: BaseType<T>;
  
  isApplicable(value: unknown): value is T {
    return this.type.isValid(value);
  }
}

/**
 * Result of a mutation test
 */
export interface MutationTestResult {
  /** The original value that was mutated */
  originalValue: any;
  
  /** Results for each mutation */
  mutations: MutationResult[];
  
  /** Summary of the test results */
  summary: {
    /** Total number of mutations tested */
    total: number;
    
    /** Number of mutations that were caught */
    caught: number;
    
    /** Number of mutations that were not caught */
    uncaught: number;
    
    /** Number of mutations that caused errors */
    errors: number;
  };
}

/**
 * Result of testing a single mutation
 */
export interface MutationResult {
  /** The mutated value */
  value: any;
  
  /** Whether the mutation was caught */
  caught: boolean;
  
  /** Error that occurred during testing */
  error?: Error;
}

/**
 * Options for mutation testing
 */
export interface MutationTestOptions {
  /** Timeout in milliseconds */
  timeout?: number;
  
  /** Whether to log verbose output */
  verbose?: boolean;
}
