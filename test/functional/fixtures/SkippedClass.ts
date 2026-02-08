/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Class with skipped methods.
 * Demonstrates skip flags via JSDoc.
 */
export class SkippedClass {
    /**
     * @fixture default []
     */
    constructor() {}

    /**
     * Normal method that should be tested.
     * @scenario args=[5] expect=10
     */
    normalMethod(value: number): number {
        return value * 2;
    }

    /**
     * Skipped method that won't be tested.
     * @skip Not yet implemented
     * @scenario args=[5] expect=25
     */
    skippedMethod(value: number): number {
        // This method is skipped, so it won't be tested.
        return value * 5;
    }

    /**
     * Another skipped method.
     * @skip
     * @scenario args=[10] expect=100
     */
    anotherSkippedMethod(value: number): number {
        return value * 10;
    }
}
