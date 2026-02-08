/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { FailResult } from '../../../../src/Runner/Result/FailResult';
import { PassResult } from '../../../../src/Runner/Result/PassResult';
import { SkipResult } from '../../../../src/Runner/Result/SkipResult';
import { TestResult } from '../../../../src/Runner/Result/TestResult';
import { WarningResult } from '../../../../src/Runner/Result/WarningResult';
import { expect } from 'chai';

describe('TestResult', function () {
    it('should store all result types', function () {
        const passes = [new PassResult('Test 1 passed')];
        const failures = [new FailResult('test2', 'Test 2 failed')];
        const skips = [new SkipResult('test3', 'Test 3 skipped')];
        const warnings = [new WarningResult('test4', 'Test 4 warning')];

        const result = new TestResult(passes, failures, skips, warnings);

        expect(result.getPasses()).to.deep.equal(passes);
        expect(result.getFailures()).to.deep.equal(failures);
        expect(result.getSkips()).to.deep.equal(skips);
        expect(result.getWarnings()).to.deep.equal(warnings);
    });

    it('should handle empty result arrays', function () {
        const result = new TestResult([], [], [], []);

        expect(result.getPasses()).to.deep.equal([]);
        expect(result.getFailures()).to.deep.equal([]);
        expect(result.getSkips()).to.deep.equal([]);
        expect(result.getWarnings()).to.deep.equal([]);
    });

    it('should handle multiple results of each type', function () {
        const passes = [
            new PassResult('Test 1'),
            new PassResult('Test 2'),
            new PassResult('Test 3'),
        ];
        const failures = [
            new FailResult('test4', 'Failed'),
            new FailResult('test5', 'Failed'),
        ];
        const skips = [new SkipResult('test6', 'Skipped')];
        const warnings = [
            new WarningResult('test7', 'Warning 1'),
            new WarningResult('test8', 'Warning 2'),
        ];

        const result = new TestResult(passes, failures, skips, warnings);

        expect(result.getPasses()).to.have.lengthOf(3);
        expect(result.getFailures()).to.have.lengthOf(2);
        expect(result.getSkips()).to.have.lengthOf(1);
        expect(result.getWarnings()).to.have.lengthOf(2);
    });

    it('should maintain result order', function () {
        const passes = [
            new PassResult('First'),
            new PassResult('Second'),
            new PassResult('Third'),
        ];

        const result = new TestResult(passes, [], [], []);

        expect(result.getPasses()[0].identifier).to.equal('First');
        expect(result.getPasses()[1].identifier).to.equal('Second');
        expect(result.getPasses()[2].identifier).to.equal('Third');
    });
});
