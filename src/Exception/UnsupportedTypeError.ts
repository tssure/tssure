/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Error thrown when an unsupported type is encountered.
 */
export class UnsupportedTypeError extends Error {
    constructor(message: string) {
        super(message);

        this.name = 'UnsupportedTypeError';

        Object.setPrototypeOf(this, UnsupportedTypeError.prototype);
    }
}
