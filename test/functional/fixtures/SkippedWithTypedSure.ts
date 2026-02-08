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
 * Class with skipped methods using TypedSure annotations.
 * Demonstrates skip flags via TypedSure type annotations.
 */
export class SkippedWithTypedSure {
    /**
     * @fixture default []
     */
    constructor() {}

    /**
     * Normal method that should be tested.
     */
    normalMethod(value: number): TypedSure<
        number,
        {
            scenarios: [{ args: [5]; expect: 10 }];
        }
    > {
        return value * 2;
    }

    /**
     * Skipped method with a reason string.
     */
    skippedWithReason(value: number): TypedSure<
        number,
        {
            scenarios: [{ args: [5]; expect: 25 }];
            skip: 'Not yet implemented';
        }
    > {
        // This method is skipped, so it won't be tested.
        return value * 5;
    }

    /**
     * Skipped method with boolean true.
     */
    skippedWithBoolean(value: number): TypedSure<
        number,
        {
            scenarios: [{ args: [10]; expect: 100 }];
            skip: true;
        }
    > {
        return value * 10;
    }
}
