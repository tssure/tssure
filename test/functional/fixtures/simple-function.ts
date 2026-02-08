/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Simple function for testing.
 */
export function add(a: number, b: number): number {
    return a + b;
}

/**
 * Function that returns a string.
 */
export function greet(name: string): string {
    return `Hello, ${name}!`;
}

/**
 * Function with union type.
 */
export function processValue(value: string | number): string {
    return String(value);
}
