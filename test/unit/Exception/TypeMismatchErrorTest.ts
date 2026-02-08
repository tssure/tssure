/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { TypeMismatchError } from '../../../src/Exception/TypeMismatchError';
import { expect } from 'chai';

describe('TypeMismatchError', () => {
    it('should create an error with the correct message', () => {
        const error = new TypeMismatchError(
            'Expected string, got number',
            'string',
            42,
        );

        expect(error.message).to.equal('Expected string, got number');
    });

    it('should store the expected type', () => {
        const error = new TypeMismatchError(
            'Expected string, got number',
            'string',
            42,
        );

        expect(error.expectedType).to.equal('string');
    });

    it('should store the actual value', () => {
        const error = new TypeMismatchError(
            'Expected string, got number',
            'string',
            42,
        );

        expect(error.actualValue).to.equal(42);
    });

    it('should have the correct name', () => {
        const error = new TypeMismatchError(
            'Expected string, got number',
            'string',
            42,
        );

        expect(error.name).to.equal('TypeMismatchError');
    });

    it('should be an instance of Error', () => {
        const error = new TypeMismatchError(
            'Expected string, got number',
            'string',
            42,
        );

        expect(error).to.be.instanceOf(Error);
    });
});
