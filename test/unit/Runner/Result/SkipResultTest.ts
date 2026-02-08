/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { SkipResult } from '../../../../src/Runner/Result/SkipResult';
import { expect } from 'chai';

describe('SkipResult', () => {
    describe('constructor()', () => {
        it('should create a skip result with identifier and message', () => {
            const result = new SkipResult('myTest', 'Skipped by user');

            expect(result.identifier).to.equal('myTest');
            expect(result.message).to.equal('Skipped by user');
        });
    });

    describe('identifier', () => {
        it('should store the identifier', () => {
            const result = new SkipResult('test::method()', 'skipped');

            expect(result.identifier).to.equal('test::method()');
        });
    });

    describe('message', () => {
        it('should store the message', () => {
            const result = new SkipResult('test', 'Not implemented yet');

            expect(result.message).to.equal('Not implemented yet');
        });
    });
});
