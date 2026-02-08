/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Represents a monetary value.
 * This demonstrates fixtures on static factory methods using JSDoc.
 */
export class MoneyWithStaticFixtures {
    private constructor(private readonly pence: number) {}

    /**
     * Creates a Money instance from pence.
     * @fixture default [1000]
     * @fixture gbp10 [1000]
     * @fixture gbp5 [500]
     */
    static fromInt(pence: number): MoneyWithStaticFixtures {
        return new MoneyWithStaticFixtures(pence);
    }

    /**
     * Gets the value in pence.
     * @scenario args=[] expect=1000
     */
    getPence(): number {
        return this.pence;
    }

    /**
     * Gets the value in pounds.
     * @scenario args=[] expect=10
     */
    getPounds(): number {
        return this.pence / 100;
    }

    /**
     * Adds another Money value.
     * @scenario description="add gbp5 to default" args=[] expect=1500
     */
    add(other: MoneyWithStaticFixtures): MoneyWithStaticFixtures {
        return new MoneyWithStaticFixtures(this.pence + other.pence);
    }

    isGreaterThan(other: MoneyWithStaticFixtures): boolean {
        return this.pence > other.pence;
    }
}
