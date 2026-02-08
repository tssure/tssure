/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { WarningResult } from '../../../../src/Runner/Result/WarningResult';
import { expect } from 'chai';

describe('WarningResult', () => {
    describe('constructor()', () => {
        it('should create a warning result with identifier and message', () => {
            const result = new WarningResult('myTest', 'No fixtures defined');

            expect(result.identifier).to.equal('myTest');
            expect(result.message).to.equal('No fixtures defined');
        });
    });

    describe('identifier', () => {
        it('should store the identifier', () => {
            const result = new WarningResult('test::method()', 'warning');

            expect(result.identifier).to.equal('test::method()');
        });
    });

    describe('message', () => {
        it('should store the message', () => {
            const result = new WarningResult('test', 'Private constructor');

            expect(result.message).to.equal('Private constructor');
        });
    });
});
