/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Error thrown when a value does not match its expected type.
 */
export class TypeMismatchError extends Error {
    constructor(
        message: string,
        public readonly expectedType: string,
        public readonly actualValue: unknown,
    ) {
        super(message);

        this.name = 'TypeMismatchError';

        Object.setPrototypeOf(this, TypeMismatchError.prototype);
    }
}
