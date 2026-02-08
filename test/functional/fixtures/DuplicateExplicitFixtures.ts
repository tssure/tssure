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
 * Test class with duplicate explicit fixture names (invalid).
 */
export class DuplicateExplicitFixtures {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    /**
     * Method with two fixtures that have the same explicit name.
     */
    getValue(): TypedSure<
        number,
        {
            fixtures: [
                { name: 'duplicate'; args: [] },
                { name: 'duplicate'; args: [] },
            ];
        }
    > {
        return this.value;
    }
}
