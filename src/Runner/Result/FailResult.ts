/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Represents a failed verification result.
 */
export class FailResult {
    constructor(
        public readonly identifier: string,
        public readonly message: string,
    ) {}
}
