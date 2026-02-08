/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Error thrown when there is a configuration issue.
 */
export class ConfigurationError extends Error {
    constructor(message: string) {
        super(message);

        this.name = 'ConfigurationError';

        Object.setPrototypeOf(this, ConfigurationError.prototype);
    }
}
