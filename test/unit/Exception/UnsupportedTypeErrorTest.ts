/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { UnsupportedTypeError } from '../../../src/Exception/UnsupportedTypeError';
import { expect } from 'chai';

describe('UnsupportedTypeError', () => {
    it('should create an error with the correct message', () => {
        const error = new UnsupportedTypeError('Unsupported type: symbol');

        expect(error.message).to.equal('Unsupported type: symbol');
    });

    it('should have the correct name', () => {
        const error = new UnsupportedTypeError('Unsupported type: symbol');

        expect(error.name).to.equal('UnsupportedTypeError');
    });

    it('should be an instance of Error', () => {
        const error = new UnsupportedTypeError('Unsupported type: symbol');

        expect(error).to.be.instanceOf(Error);
    });
});
