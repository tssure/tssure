/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Calculator with fixtures defined on the constructor.
 * This demonstrates how to use Fixture and Scenario metadata via JSDoc.
 */
export class CalculatorWithFixtures {
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
     * @scenario description="add5" args=[5] expect=15 instance="default"
     */
    add(value: number): number {
        return this.base + value;
    }

    /**
     * Multiplies the base by a value.
     * @scenario description="multiply3" args=[3] expect=15 instance="base5"
     */
    multiply(value: number): number {
        return this.base * value;
    }

    /**
     * Returns the base value.
     * @scenario args=[] expect=10
     */
    getBase(): number {
        return this.base;
    }

    /**
     * Returns the base value from base5 fixture.
     *
     * @scenario description="getBase5" args=[] expect=5 instance="base5"
     */
    getBase5(): number {
        return this.base;
    }
}
