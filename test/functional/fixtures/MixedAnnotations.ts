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
 * Example class demonstrating both JSDoc and TypedSure annotations.
 * This shows that both approaches can coexist in the same codebase.
 */
export class MixedAnnotations {
    private readonly value: number;

    /**
     * Creates an instance with a value.
     * @fixture default [100]
     * @fixture custom [200]
     */
    constructor(value: number) {
        this.value = value;
    }

    /**
     * Doubles the value using JSDoc annotation.
     * @scenario description="double100" args=[] expect=200 instance="default"
     */
    doubleWithJSDoc(): number {
        return this.value * 2;
    }

    /**
     * Triples the value using TypedSure annotation.
     */
    tripleWithTypedSure(): TypedSure<
        number,
        {
            scenarios: [
                {
                    description: 'triple100';
                    args: [];
                    expect: 300;
                    instance: 'default';
                },
            ];
        }
    > {
        return this.value * 3;
    }

    /**
     * Adds a value - demonstrates both can be used on same method.
     * @scenario description="add10_jsdoc" args=[10] expect=110
     */
    addValue(amount: number): TypedSure<
        number,
        {
            scenarios: [
                { description: 'add20_typed'; args: [20]; expect: 120 },
            ];
        }
    > {
        return this.value + amount;
    }
}
