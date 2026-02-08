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
 * Test class with valid unique fixture names.
 */
export class ValidUniqueFixtures {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    /**
     * Method with two fixtures that have unique names.
     */
    getValue(): TypedSure<
        number,
        {
            fixtures: [
                { name: 'default'; args: [] },
                { name: 'custom'; args: [] },
            ];
        }
    > {
        return this.value;
    }
}
