/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { ConfigurationError } from '../../../src/Exception/ConfigurationError';
import { expect } from 'chai';

describe('ConfigurationError', function () {
    it('should extend Error', function () {
        const error = new ConfigurationError('Test error');

        expect(error).to.be.instanceOf(Error);
    });

    it('should store the message', function () {
        const error = new ConfigurationError('Configuration is invalid');

        expect(error.message).to.equal('Configuration is invalid');
    });

    it('should have correct name', function () {
        const error = new ConfigurationError('Test error');

        expect(error.name).to.equal('ConfigurationError');
    });

    it('should be throwable and catchable', function () {
        expect(() => {
            throw new ConfigurationError('Test error');
        }).to.throw(ConfigurationError, 'Test error');
    });

    it('should preserve stack trace', function () {
        const error = new ConfigurationError('Test error');

        expect(error.stack).to.be.a('string');
        expect(error.stack).to.include('ConfigurationError');
    });
});
