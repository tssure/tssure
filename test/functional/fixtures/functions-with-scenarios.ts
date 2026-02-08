/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Adds two numbers together.
 * @scenario description="add 2 and 3" args=[2, 3] expect=5
 * @scenario description="add 10 and 20" args=[10, 20] expect=30
 */
export function addNumbers(a: number, b: number): number {
    return a + b;
}

/**
 * Multiplies two numbers.
 * @scenario description="multiply 2 and 3" args=[2, 3] expect=6
 * @scenario description="multiply 5 and 4" args=[5, 4] expect=20
 */
export function multiplyNumbers(a: number, b: number): number {
    return a * b;
}

/**
 * Formats a greeting message.
 * @scenario description="formal greeting" args=["Alice", true] expect="Good day, Alice."
 * @scenario description="informal greeting" args=["Bob", false] expect="Hi, Bob!"
 */
export function formatGreeting(name: string, formal: boolean): string {
    return formal ? `Good day, ${name}.` : `Hi, ${name}!`;
}

/**
 * Processes a value that can be string or number.
 * @scenario description="process number" args=[42] expect="Number: 42"
 * @scenario description="process string" args=["hello"] expect="String: hello"
 */
export function processValue(value: string | number): string {
    if (typeof value === 'number') {
        return `Number: ${value}`;
    }
    return `String: ${value}`;
}
