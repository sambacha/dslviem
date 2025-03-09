/**
 * Base interface for all properties in the DSL
 * Properties are used to generate values of specific types
 */
export interface Property<T> {
  /** Name of the property */
  name: string;
  
  /** Generates a value of type T */
  generate(): T | Promise<T>;
}

/**
 * Abstract base class for all properties
 * Provides a common structure for property implementations
 */
export abstract class BaseProperty<T> implements Property<T> {
  abstract name: string;
  abstract generate(): T | Promise<T>;
}

/**
 * Interface for properties that can be verified
 * These properties maintain a set of verified values
 */
export interface VerifiableProperty<T> extends Property<T> {
  /** Set of values that have been verified to be valid */
  verifiedValues: Set<T>;
  
  /** Adds a value to the set of verified values */
  addVerifiedValue(value: T): void;
  
  /** Gets a random verified value */
  getVerifiedValue(): T | undefined;
}

/**
 * Base class for verifiable properties
 */
export abstract class BaseVerifiableProperty<T> extends BaseProperty<T> implements VerifiableProperty<T> {
  verifiedValues: Set<T> = new Set();
  
  addVerifiedValue(value: T): void {
    this.verifiedValues.add(value);
  }
  
  getVerifiedValue(): T | undefined {
    if (this.verifiedValues.size === 0) {
      return undefined;
    }
    
    const values = Array.from(this.verifiedValues);
    return values[Math.floor(Math.random() * values.length)];
  }
}
