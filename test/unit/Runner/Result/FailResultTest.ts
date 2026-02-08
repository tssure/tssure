/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { FailResult } from '../../../../src/Runner/Result/FailResult';
import { expect } from 'chai';

describe('FailResult', function () {
    it('should store the identifier and message', function () {
        const result = new FailResult('test1', 'Test failed');

        expect(result.identifier).to.equal('test1');
        expect(result.message).to.equal('Test failed');
    });

    it('should handle different message types', function () {
        const result1 = new FailResult('test1', 'Simple message');
        const result2 = new FailResult(
            'test2',
            'Message with details: expected 5, got 3',
        );

        expect(result1.identifier).to.equal('test1');
        expect(result1.message).to.equal('Simple message');
        expect(result2.identifier).to.equal('test2');
        expect(result2.message).to.equal(
            'Message with details: expected 5, got 3',
        );
    });

    it('should create multiple independent instances', function () {
        const result1 = new FailResult('test1', 'First failure');
        const result2 = new FailResult('test2', 'Second failure');

        expect(result1.identifier).to.equal('test1');
        expect(result1.message).to.equal('First failure');
        expect(result2.identifier).to.equal('test2');
        expect(result2.message).to.equal('Second failure');
    });
});
