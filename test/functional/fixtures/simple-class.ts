/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Simple class for testing.
 */
export class Calculator {
    constructor(private precision: number = 2) {}

    add(a: number, b: number): number {
        return this.round(a + b);
    }

    subtract(a: number, b: number): number {
        return this.round(a - b);
    }

    private round(value: number): number {
        return (
            Math.round(value * Math.pow(10, this.precision)) /
            Math.pow(10, this.precision)
        );
    }
}
