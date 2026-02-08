/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { PassResult } from '../../../../src/Runner/Result/PassResult';
import { expect } from 'chai';

describe('PassResult', function () {
    it('should store the identifier', function () {
        const result = new PassResult('Test passed');

        expect(result.identifier).to.equal('Test passed');
    });

    it('should handle different identifier types', function () {
        const result1 = new PassResult('Simple pass');
        const result2 = new PassResult('Function add(1, 2) returned 3');

        expect(result1.identifier).to.equal('Simple pass');
        expect(result2.identifier).to.equal('Function add(1, 2) returned 3');
    });

    it('should create multiple independent instances', function () {
        const result1 = new PassResult('First test');
        const result2 = new PassResult('Second test');

        expect(result1.identifier).to.equal('First test');
        expect(result2.identifier).to.equal('Second test');
    });
});
