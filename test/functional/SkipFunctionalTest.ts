/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { TypeAsserter } from '../../src/Assert/TypeAsserter';
import { ClassDiscoverer } from '../../src/Discovery/ClassDiscoverer';
import { Scanner } from '../../src/Discovery/Scanner';
import { TestExecutor } from '../../src/Execution/TestExecutor';
import { Runner } from '../../src/Runner/Runner';
import { CombinedParser } from '../../src/Type/CombinedParser';
import { JSDocParser } from '../../src/Type/JSDocParser';
import { TypedSureParser } from '../../src/Type/TypedSureParser';
import { FixtureValidator } from '../../src/Validation/FixtureValidator';
import { expect } from 'chai';
import * as path from 'path';

describe('Skip Functional Tests', function () {
    this.timeout(10000);

    let scanner: Scanner;
    let parser: CombinedParser;
    let classDiscoverer: ClassDiscoverer;
    let fixtureValidator: FixtureValidator;
    let typeAsserter: TypeAsserter;
    let testExecutor: TestExecutor;
    let runner: Runner;

    beforeEach(() => {
        scanner = new Scanner();
        const jsDocParser = new JSDocParser();
        const typedSureParser = new TypedSureParser();
        parser = new CombinedParser(jsDocParser, typedSureParser);
        classDiscoverer = new ClassDiscoverer(parser);
        fixtureValidator = new FixtureValidator();
        typeAsserter = new TypeAsserter();
        testExecutor = new TestExecutor(typeAsserter);
        runner = new Runner(
            scanner,
            classDiscoverer,
            fixtureValidator,
            testExecutor,
        );
    });

    describe('JSDoc @skip annotation', () => {
        it('should skip methods marked with @skip and reason', () => {
            const fixturePath = path.join(
                __dirname,
                'fixtures/SkippedClass.ts',
            );

            const result = runner.run(fixturePath);

            // Should have 1 pass (normalMethod), 0 failures, and 2 skips.
            expect(result.getPassCount()).to.equal(1);
            expect(result.getFailCount()).to.equal(0);
            expect(result.getSkipCount()).to.equal(2);

            const skips = result.getSkips();
            expect(skips).to.have.lengthOf(2);

            // Check first skip (with reason).
            expect(skips[0].identifier).to.include('skippedMethod');
            expect(skips[0].message).to.equal('Not yet implemented');

            // Check second skip (without reason).
            expect(skips[1].identifier).to.include('anotherSkippedMethod');
            expect(skips[1].message).to.equal('Skipped');
        });

        it('should execute non-skipped methods normally', () => {
            const fixturePath = path.join(
                __dirname,
                'fixtures/SkippedClass.ts',
            );

            const result = runner.run(fixturePath);

            const passes = result.getPasses();
            expect(passes).to.have.lengthOf(1);
            expect(passes[0].identifier).to.include('normalMethod');
        });
    });

    describe('TypedSure skip annotation', () => {
        it('should skip methods marked with skip: string', () => {
            const fixturePath = path.join(
                __dirname,
                'fixtures/SkippedWithTypedSure.ts',
            );

            const result = runner.run(fixturePath);

            // Should have 1 pass (normalMethod), 0 failures, and 2 skips.
            expect(result.getPassCount()).to.equal(1);
            expect(result.getFailCount()).to.equal(0);
            expect(result.getSkipCount()).to.equal(2);

            const skips = result.getSkips();
            expect(skips).to.have.lengthOf(2);

            // Check first skip (with reason string).
            expect(skips[0].identifier).to.include('skippedWithReason');
            expect(skips[0].message).to.equal('Not yet implemented');

            // Check second skip (with boolean true).
            expect(skips[1].identifier).to.include('skippedWithBoolean');
            expect(skips[1].message).to.equal('Skipped');
        });

        it('should execute non-skipped methods normally', () => {
            const fixturePath = path.join(
                __dirname,
                'fixtures/SkippedWithTypedSure.ts',
            );

            const result = runner.run(fixturePath);

            const passes = result.getPasses();
            expect(passes).to.have.lengthOf(1);
            expect(passes[0].identifier).to.include('normalMethod');
        });
    });

    describe('Skip output formatting', () => {
        it('should include skip information in summary', () => {
            const fixturePath = path.join(
                __dirname,
                'fixtures/SkippedClass.ts',
            );

            const result = runner.run(fixturePath);
            const summary = result.getSummary();

            expect(summary).to.include('Skipped: 2');
            expect(summary).to.include('SKIP: SkippedClass.skippedMethod');
            expect(summary).to.include('Not yet implemented');
            expect(summary).to.include(
                'SKIP: SkippedClass.anotherSkippedMethod',
            );
        });

        it('should include TypedSure skip information in summary', () => {
            const fixturePath = path.join(
                __dirname,
                'fixtures/SkippedWithTypedSure.ts',
            );

            const result = runner.run(fixturePath);
            const summary = result.getSummary();

            expect(summary).to.include('Skipped: 2');
            expect(summary).to.include(
                'SKIP: SkippedWithTypedSure.skippedWithReason',
            );
            expect(summary).to.include('Not yet implemented');
            expect(summary).to.include(
                'SKIP: SkippedWithTypedSure.skippedWithBoolean',
            );
        });
    });
});
