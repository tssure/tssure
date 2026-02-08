/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { InvalidPathError } from '../../../src/Exception/InvalidPathError';
import { expect } from 'chai';

describe('InvalidPathError', function () {
    it('should extend Error', function () {
        const error = new InvalidPathError('Test error');

        expect(error).to.be.instanceOf(Error);
    });

    it('should store the message', function () {
        const error = new InvalidPathError('Path does not exist');

        expect(error.message).to.equal('Path does not exist');
    });

    it('should have correct name', function () {
        const error = new InvalidPathError('Test error');

        expect(error.name).to.equal('InvalidPathError');
    });

    it('should be throwable and catchable', function () {
        expect(() => {
            throw new InvalidPathError('Invalid path');
        }).to.throw(InvalidPathError, 'Invalid path');
    });

    it('should preserve stack trace', function () {
        const error = new InvalidPathError('Test error');

        expect(error.stack).to.be.a('string');
        expect(error.stack).to.include('InvalidPathError');
    });
});
