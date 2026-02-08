/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { TypedSure } from '../../../src/Type/TypedSure';

/**
 * Calculator with fixtures and scenarios defined via TypedSure type annotations.
 * This demonstrates how to use TypedSure for type-based metadata.
 */
export class CalculatorWithTypedSure {
    private readonly base: number;

    /**
     * Creates a calculator with a base value.
     * @fixture default [10]
     * @fixture base5 [5]
     */
    constructor(base: number) {
        this.base = base;
    }

    /**
     * Adds a value to the base.
     */
    add(value: number): TypedSure<
        number,
        {
            scenarios: [
                {
                    description: 'add5';
                    args: [5];
                    expect: 15;
                    instance: 'default';
                },
            ];
        }
    > {
        return this.base + value;
    }

    /**
     * Multiplies the base by a value.
     */
    multiply(value: number): TypedSure<
        number,
        {
            scenarios: [
                {
                    description: 'multiply3';
                    args: [3];
                    expect: 15;
                    instance: 'base5';
                },
            ];
        }
    > {
        return this.base * value;
    }

    /**
     * Returns the base value.
     */
    getBase(): TypedSure<
        number,
        {
            scenarios: [{ args: []; expect: 10 }];
        }
    > {
        return this.base;
    }

    /**
     * Returns the base value from base5 fixture.
     */
    getBase5(): TypedSure<
        number,
        {
            scenarios: [
                {
                    description: 'getBase5';
                    args: [];
                    expect: 5;
                    instance: 'base5';
                },
            ];
        }
    > {
        return this.base;
    }
}
