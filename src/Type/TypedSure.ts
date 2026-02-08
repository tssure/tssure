/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Scenario definition for TypedSure.
 */
export interface TypedSureScenario {
    /**
     * Optional description of the scenario.
     */
    description?: string;

    /**
     * Positional array of arguments, in parameter order.
     */
    args: unknown[];

    /**
     * Optional expected value. For POC, supports "type check" and scalar equality.
     */
    expect?: unknown;

    /**
     * Name of the fixture to use for creating the instance.
     * Only applicable to instance method scenarios. Defaults to 'default' if not specified.
     */
    instance?: string;
}

/**
 * Fixture definition for TypedSure.
 */
export interface TypedSureFixture {
    /**
     * Name of this fixture. Defaults to 'default'.
     * Note: There can only be one fixture with the name 'default' per class.
     */
    name?: string;

    /**
     * Arguments to pass to the constructor or factory method.
     */
    args: unknown[];

    /**
     * Optional description of the fixture scenario.
     */
    description?: string;

    /**
     * Optional expected value for the fixture scenario.
     */
    expect?: unknown;
}

/**
 * Metadata configuration for TypedSure.
 */
export interface TypedSureMetadata {
    /**
     * Array of scenario definitions.
     */
    scenarios?: TypedSureScenario[];

    /**
     * Array of fixture definitions.
     */
    fixtures?: TypedSureFixture[];

    /**
     * Optional skip flag. If set to true or a string reason, the test will be skipped.
     */
    skip?: boolean | string;
}

/**
 * Type wrapper that allows defining scenarios and fixtures via the type system.
 * This is a phantom type that doesn't affect runtime behaviour but allows
 * metadata to be extracted from the type signature.
 *
 * @template T The actual return type of the function/method.
 * @template M The metadata configuration containing scenarios and/or fixtures.
 *
 * @example
 * ```typescript
 * multiply(value: number): TypedSure<number, {
 *     scenarios: [
 *         {description: 'multiply3', args: [3], expect: 15, instance: 'base5'}
 *     ]
 * }> {
 *     return this.base * value;
 * }
 * ```
 *
 * @example Skip a test
 * ```typescript
 * notImplementedYet(): TypedSure<number, {
 *     skip: 'Not yet implemented'
 * }> {
 *     throw new Error('Not implemented');
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type TypedSure<T, M extends TypedSureMetadata = TypedSureMetadata> = T;
