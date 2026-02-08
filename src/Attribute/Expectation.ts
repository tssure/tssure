/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Enum for special expectation values in verification scenarios.
 */
export enum Expectation {
    /**
     * Indicates that the scenario should only verify that the return type matches,
     * without checking the actual return value.
     */
    TYPE_CHECK = 'TYPE_CHECK',
}
