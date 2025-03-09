/**
 * Base interface for all types in the DSL
 * Defines the common operations that all types must support
 */
export interface BaseType<T> {
  /** Name of the type */
  name: string;
  
  /** Validates if a value is of this type */
  isValid(value: unknown): value is T;
  
  /** Checks if this type can be mutated to another type */
  mutable(otherType: BaseType<any>): boolean;
  
  /** Unrolls a value of this type into a record for comparison */
  unrollValue(value: T): Record<string, any>;
}

/**
 * Abstract base class for all types
 * Provides default implementations for common operations
 */
export abstract class Type<T> implements BaseType<T> {
  abstract name: string;
  abstract isValid(value: unknown): value is T;
  
  mutable(otherType: BaseType<any>): boolean {
    return otherType.name === this.name;
  }
  
  unrollValue(value: T): Record<string, any> {
    return { rv: value };
  }
}
