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

describe('Runner Functional', function () {
    this.timeout(5000);

    let runner: Runner;
    let scanner: Scanner;
    let classDiscoverer: ClassDiscoverer;
    let fixtureValidator: FixtureValidator;

    beforeEach(function () {
        scanner = new Scanner();
        const jsDocParser = new JSDocParser();
        const typedSureParser = new TypedSureParser();
        const parser = new CombinedParser(jsDocParser, typedSureParser);
        classDiscoverer = new ClassDiscoverer(parser);
        fixtureValidator = new FixtureValidator();
        const typeAsserter = new TypeAsserter();
        const testExecutor = new TestExecutor(typeAsserter);

        runner = new Runner(
            scanner,
            classDiscoverer,
            fixtureValidator,
            testExecutor,
        );
    });

    it('should run tests on fixture files', function () {
        const fixturePath = path.join(
            __dirname,
            'fixtures',
            'CalculatorWithFixtures.ts',
        );

        const result = runner.run(fixturePath);

        // Should have test results from executing scenarios.
        expect(result.getPasses().length).to.be.greaterThan(0);
    });

    it('should run tests on multiple fixture files', function () {
        const fixturesDir = path.join(__dirname, 'fixtures');

        const result = runner.run(fixturesDir);

        // Should have test results from executing scenarios.
        expect(result.getPasses().length).to.be.greaterThan(0);
    });

    it('should handle directory with TypeScript files', function () {
        const fixturesDir = path.join(__dirname, 'fixtures');

        const result = runner.run(fixturesDir);

        expect(result).to.not.be.null;
        expect(result.getPasses()).to.be.an('array');
        expect(result.getFailures()).to.be.an('array');
        expect(result.getSkips()).to.be.an('array');
        expect(result.getWarnings()).to.be.an('array');
    });
});
