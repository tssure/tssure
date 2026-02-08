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

describe('Duplicate Fixture Validation', function () {
    this.timeout(5000);

    let runner: Runner;

    beforeEach(function () {
        const scanner = new Scanner();
        const jsDocParser = new JSDocParser();
        const typedSureParser = new TypedSureParser();
        const parser = new CombinedParser(jsDocParser, typedSureParser);
        const classDiscoverer = new ClassDiscoverer(parser);
        const fixtureValidator = new FixtureValidator();
        const typeAsserter = new TypeAsserter();
        const testExecutor = new TestExecutor(typeAsserter);
        runner = new Runner(
            scanner,
            classDiscoverer,
            fixtureValidator,
            testExecutor,
        );
    });

    it('should report failure when two fixtures use default name', function () {
        const fixturePath = path.join(
            __dirname,
            'fixtures',
            'DuplicateFixtures.ts',
        );

        const result = runner.run(fixturePath);

        expect(result.getFailures()).to.have.lengthOf(1);
        expect(result.getFailures()[0].identifier).to.equal(
            'DuplicateFixtures',
        );
        expect(result.getFailures()[0].message).to.include(
            'Duplicate fixture name "default"',
        );
        expect(result.getFailures()[0].message).to.include('2 times');
        expect(result.getFailures()[0].message).to.include('DuplicateFixtures');
    });

    it('should report failure when two fixtures have same explicit name', function () {
        const fixturePath = path.join(
            __dirname,
            'fixtures',
            'DuplicateExplicitFixtures.ts',
        );

        const result = runner.run(fixturePath);

        expect(result.getFailures()).to.have.lengthOf(1);
        expect(result.getFailures()[0].identifier).to.equal(
            'DuplicateExplicitFixtures',
        );
        expect(result.getFailures()[0].message).to.include(
            'Duplicate fixture name "duplicate"',
        );
        expect(result.getFailures()[0].message).to.include('2 times');
        expect(result.getFailures()[0].message).to.include(
            'DuplicateExplicitFixtures',
        );
    });

    it('should not report failure when all fixtures have unique names', function () {
        const fixturePath = path.join(
            __dirname,
            'fixtures',
            'ValidUniqueFixtures.ts',
        );

        const result = runner.run(fixturePath);

        expect(result.getFailures()).to.have.lengthOf(0);
    });

    it('should not use Skip results for duplicate fixture errors', function () {
        const fixturePath = path.join(
            __dirname,
            'fixtures',
            'DuplicateFixtures.ts',
        );

        const result = runner.run(fixturePath);

        // Duplicate fixtures should be reported as failures, not skips.
        expect(result.getSkips()).to.have.lengthOf(0);
        expect(result.getFailures()).to.have.lengthOf(1);
    });

    it('should validate fixtures across multiple classes in same file', function () {
        // Create a test file with multiple classes.
        const fixturePath = path.join(
            __dirname,
            'fixtures',
            'MultipleClassesWithDuplicates.ts',
        );

        const result = runner.run(fixturePath);

        // Each class with duplicate fixtures should have a separate failure.
        const duplicateFailures = result
            .getFailures()
            .filter((f) => f.message.includes('Duplicate fixture name'));

        expect(duplicateFailures.length).to.be.greaterThan(0);
    });
});
