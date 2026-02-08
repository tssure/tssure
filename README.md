# TSSure

[![Build Status](https://github.com/tssure/tssure/workflows/CI/badge.svg)](https://github.com/tssure/tssure/actions?query=workflow%3ACI)

[PRE-ALPHA] Not yet ready for general use; use for experimentation and feedback only.

An automated contract guard framework for TypeScript that validates your code's type contracts at runtime.

## What is TSSure?

TSSure automatically exercises your functions and methods to ensure they honour their type declarations. It bridges the gap between static type checking and unit testing by:

- **Automatically generating verification inputs** for your functions and methods based on their type annotations
- **Validating return types** match their declarations
- **Verifying with custom scenarios** using JSDoc annotations or TypedSure type annotations to define specific verification cases
- **Catching type contract violations** before they become runtime bugs

Think of it as automated contract verification that ensures your code does what its type signatures promise.

## Installation

```bash
npm install --save-dev tssure
```

## Command Line Usage

### Scan a directory or file

```bash
npx tssure scan <directory-or-file>
```

**Examples:**

```bash
# Scan an entire directory
npx tssure scan src/

# Scan a specific file
npx tssure scan src/MyClass.ts
```

The `scan` command will:
1. Discover all functions and classes exported from ES modules in the specified path
2. Generate verification inputs based on type annotations
3. Execute each function/method with the generated inputs
4. Verify that return values match their declared types and optionally expected return values
5. Report any type contract violations

### Exit Codes

- `0` - All verifications passed
- `1` - Configuration error or invalid usage
- `3` - One or more verification failures detected

## How It Works

TSSure uses TypeScript's Compiler API to discover your code and automatically verify it:

### Basic Type Checking

For functions and methods without explicit verification scenarios, TSSure automatically generates appropriate inputs based on parameter types and validates the return type:

```typescript
export function add(a: number, b: number): number {
    return a + b;
}
```

TSSure will automatically exercise this function with generated number values and verify the result is a number.

### Custom Verification Scenarios

Define specific verification cases using JSDoc annotations or type annotations:

**Using JSDoc Annotations:**

```typescript
/**
 * Adds two numbers together.
 * @scenario description="adds positive numbers" args=[2, 3] expect=5
 * @scenario description="adds negative numbers" args=[-2, -3] expect=-5
 */
export function add(a: number, b: number): number {
    return a + b;
}
```

**Using TypedSure (Type-Based Annotations):**

```typescript
import { TypedSure } from 'tssure';

export function add(a: number, b: number): TypedSure<number, {
    scenarios: [
        { description: 'adds positive numbers', args: [2, 3], expect: 5 },
        { description: 'adds negative numbers', args: [-2, -3], expect: -5 }
    ]
}> {
    return a + b;
}
```

Both approaches are fully supported and can even be mixed in the same codebase. See [TypedSure Documentation](docs/TYPEDSURE.md) for more details on type-based annotations.

### Fixture-Based Verification

For classes with complex constructors, define fixtures using JSDoc annotations or TypedSure type annotations:

**Using JSDoc Annotations:**

```typescript
export class Calculator {
    /**
     * Creates a calculator with a precision value.
     * @fixture default [10]
     */
    constructor(private precision: number) {}

    /**
     * Adds two numbers with precision.
     * @scenario args=[2.5, 3.7] expect=6.2 instance="default"
     * @scenario args=[1.5, 2.7] expect=4.2
     */
    add(a: number, b: number): number {
        return Math.round((a + b) * Math.pow(10, this.precision)) / Math.pow(10, this.precision);
    }
}
```

**Using TypedSure:**

```typescript
import { TypedSure } from 'tssure';

export class Calculator {
    /**
     * Note: Constructors cannot use TypedSure annotations (TypeScript doesn't allow
     * return type annotations on constructors). Use JSDoc @fixture annotations instead.
     * @fixture default [10]
     */
    constructor(private precision: number) {}

    add(a: number, b: number): TypedSure<number, {
        scenarios: [
            { args: [2.5, 3.7], expect: 6.2, instance: 'default' },
            { args: [1.5, 2.7], expect: 4.2 }
        ]
    }> {
        return Math.round((a + b) * Math.pow(10, this.precision)) / Math.pow(10, this.precision);
    }
}
```

Note that `Fixture`s are also `Scenario`s - they'll be executed as verification cases in the same way too.

## Why Not Decorators?

You might wonder why TSSure doesn't support TypeScript decorators (e.g., `@Scenario`, `@Fixture`). Decorators are not currently supported for the following reasons:

**Runtime Overhead Concerns:**
- Decorators require `experimentalDecorators` and `emitDecoratorMetadata` to be enabled in TypeScript configuration
- `emitDecoratorMetadata` emits additional runtime type information, increasing bundle size
- The `reflect-metadata` polyfill adds runtime overhead for metadata storage and retrieval
- For a compile-time tool that scans code statically, this runtime overhead provides no benefit

**Static Analysis Approach:**
- TSSure uses TypeScript's Compiler API to analyse code statically at scan time
- JSDoc annotations and TypedSure type annotations can be extracted during static analysis without any runtime cost
- This approach is more aligned with TSSure's design philosophy of zero runtime impact on production code

**Better Alternatives:**
- **JSDoc annotations** are lightweight, well-supported by IDEs, and require no special TypeScript configuration
- **TypedSure type annotations** provide type safety and IDE support without runtime overhead
- Both approaches work seamlessly with TSSure's static analysis engine

If decorator support becomes necessary in the future (e.g., for runtime-based testing scenarios), it can be added as an opt-in feature. For now, JSDoc and TypedSure (type-based annotations) provide all the functionality needed without the runtime costs.

## Verification Results

TSSure categorizes verification results into:

- **Pass** ✓ - Function/method returned a value matching its type declaration
- **Fail** ✗ - Type contract violation detected
- **Skip** ⊘ - Verification skipped (e.g., the `@Skip` decorator was used)
- **Warning** ⚠ - Potential issue detected (e.g., private constructor without fixtures)

## Why TSSure?

Traditional unit tests require you to manually write test cases for every function and method. TSSure automates this process by:

1. **Reducing boilerplate** - No need to write basic type validation tests
2. **Ensuring consistency** - Every function gets tested, not just the ones you remember to test
3. **Catching regressions** - Automatically detects when code changes break type contracts
4. **Complementing static analysis** - Validates runtime behaviour, not just static types

TSSure doesn't replace _all of_ your unit tests - it complements them by handling the tedious work of validating type contracts, letting you focus your unit tests on business logic and edge cases.

## Relationship to PHPSure

TSSure is the TypeScript equivalent of [PHPSure](https://github.com/phpsure/phpsure), bringing the same automated contract verification approach to the TypeScript ecosystem. While PHPSure uses PHP's Reflection API, TSSure leverages TypeScript's Compiler API for type inference and code discovery.
