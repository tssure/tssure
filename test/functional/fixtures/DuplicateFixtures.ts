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
 * Test class with duplicate fixture names (invalid).
 */
export class DuplicateFixtures {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    /**
     * Method with two fixtures that both use the default name.
     */
    getValue(): TypedSure<
        number,
        {
            fixtures: [{ args: [] }, { args: [] }];
        }
    > {
        return this.value;
    }
}
