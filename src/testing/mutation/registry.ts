import { BaseType } from '../../types/base';
import { TypedMutationOperator } from './base';
import { 
  AddressMutator, 
  BlockTagMutator, 
  BlockNumberMutator, 
  HashMutator,
  BooleanMutator,
  NumberMutator,
  StringMutator,
  ArrayMutator
} from './operators';

/**
 * Registry for mutation operators
 * Manages a collection of mutation operators and provides access to them
 */
export class MutationRegistry {
  private operators: Map<string, TypedMutationOperator<any>> = new Map();
  
  /**
   * Create a new mutation registry with default operators
   * @param includeDefaults Whether to include default operators
   */
  constructor(includeDefaults: boolean = true) {
    if (includeDefaults) {
      this.registerDefaults();
    }
  }
  
  /**
   * Register a mutation operator
   * @param operator The operator to register
   */
  register<T>(operator: TypedMutationOperator<T>): void {
    this.operators.set(operator.type.name, operator);
  }
  
  /**
   * Get a mutation operator for a type
   * @param type The type to get an operator for
   * @returns The operator, or undefined if none is registered
   */
  getOperator<T>(type: BaseType<T>): TypedMutationOperator<T> | undefined {
    return this.operators.get(type.name) as TypedMutationOperator<T>;
  }
  
  /**
   * Get all registered operators
   * @returns An array of all registered operators
   */
  getAllOperators(): TypedMutationOperator<any>[] {
    return Array.from(this.operators.values());
  }
  
  /**
   * Generate mutations for a value
   * @param value The value to mutate
   * @param type The type of the value
   * @returns An array of mutations
   */
  mutate<T>(value: T, type: BaseType<T>): T[] {
    const operator = this.getOperator(type);
    if (operator && operator.isApplicable(value)) {
      return operator.mutate(value);
    }
    return [value]; // No mutation if no operator found
  }
  
  /**
   * Register default mutation operators
   */
  private registerDefaults(): void {
    this.register(new AddressMutator());
    this.register(new BlockTagMutator());
    this.register(new BlockNumberMutator());
    this.register(new HashMutator());
    this.register(new BooleanMutator());
    this.register(new NumberMutator());
    this.register(new StringMutator());
    this.register(new ArrayMutator());
  }
}

/**
 * Create a default mutation registry
 * @returns A new mutation registry with default operators
 */
export function createDefaultRegistry(): MutationRegistry {
  return new MutationRegistry(true);
}
