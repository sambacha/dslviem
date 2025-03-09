import { BaseType, Type } from './base';

/**
 * Array type
 * Represents an array of elements of a specific type
 */
export class TArray<T> extends Type<T[]> {
  name: string;
  private baseType: BaseType<T>;
  
  constructor(baseType: BaseType<T>) {
    super();
    this.baseType = baseType;
    this.name = `Array(${baseType.name})`;
  }
  
  isValid(value: unknown): value is T[] {
    return Array.isArray(value) && 
           value.every(item => this.baseType.isValid(item));
  }
  
  mutable(otherType: BaseType<any>): boolean {
    return otherType.name === this.name;
  }
  
  unrollValue(arr: T[]): Record<string, any> {
    const result: Record<string, any> = { rv: arr };
    
    arr.forEach((item, index) => {
      result[`rv[${index}]`] = item;
    });
    
    return result;
  }
}

/**
 * Union type
 * Represents a value that can be one of two types
 */
export class TUnion<T1, T2> extends Type<T1 | T2> {
  name: string;
  private type1: BaseType<T1>;
  private type2: BaseType<T2>;
  
  constructor(type1: BaseType<T1>, type2: BaseType<T2>) {
    super();
    this.type1 = type1;
    this.type2 = type2;
    this.name = `(${type1.name} | ${type2.name})`;
  }
  
  isValid(value: unknown): value is T1 | T2 {
    return this.type1.isValid(value) || this.type2.isValid(value);
  }
  
  mutable(otherType: BaseType<any>): boolean {
    return this.type1.mutable(otherType) || this.type2.mutable(otherType);
  }
  
  unrollValue(value: T1 | T2): Record<string, any> {
    if (this.type1.isValid(value)) {
      return this.type1.unrollValue(value);
    } else if (this.type2.isValid(value)) {
      return this.type2.unrollValue(value);
    }
    return { rv: value };
  }
}

/**
 * Optional type
 * Represents a value that can be of a specific type or undefined
 */
export class TOptional<T> extends Type<T | undefined> {
  name: string;
  private baseType: BaseType<T>;
  
  constructor(baseType: BaseType<T>) {
    super();
    this.baseType = baseType;
    this.name = `Optional(${baseType.name})`;
  }
  
  isValid(value: unknown): value is T | undefined {
    return value === undefined || this.baseType.isValid(value);
  }
  
  unrollValue(value: T | undefined): Record<string, any> {
    if (value === undefined) {
      return { rv: undefined };
    }
    return this.baseType.unrollValue(value);
  }
}

/**
 * Record type
 * Represents an object with string keys and values of a specific type
 */
export class TRecord<T> extends Type<Record<string, T>> {
  name: string;
  private valueType: BaseType<T>;
  
  constructor(valueType: BaseType<T>) {
    super();
    this.valueType = valueType;
    this.name = `Record(${valueType.name})`;
  }
  
  isValid(value: unknown): value is Record<string, T> {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    
    return Object.values(value).every(v => this.valueType.isValid(v));
  }
  
  unrollValue(record: Record<string, T>): Record<string, any> {
    const result: Record<string, any> = { rv: record };
    
    Object.entries(record).forEach(([key, value]) => {
      result[`rv.${key}`] = value;
    });
    
    return result;
  }
}
