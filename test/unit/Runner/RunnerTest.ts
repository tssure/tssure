/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { ClassDiscovererInterface } from '../../../src/Discovery/ClassDiscovererInterface';
import { ScannerInterface } from '../../../src/Discovery/ScannerInterface';
import { TestExecutorInterface } from '../../../src/Execution/TestExecutorInterface';
import { Runner } from '../../../src/Runner/Runner';
import { FixtureValidatorInterface } from '../../../src/Validation/FixtureValidatorInterface';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as ts from 'typescript';

describe('Runner', () => {
    let scanner: sinon.SinonStubbedInstance<ScannerInterface>;
    let classDiscoverer: sinon.SinonStubbedInstance<ClassDiscovererInterface>;
    let fixtureValidator: sinon.SinonStubbedInstance<FixtureValidatorInterface>;
    let testExecutor: sinon.SinonStubbedInstance<TestExecutorInterface>;
    let runner: Runner;

    beforeEach(() => {
        scanner = {
            scan: sinon.stub(),
        };
        classDiscoverer = {
            discoverClasses: sinon.stub(),
        };
        fixtureValidator = {
            validateFixtures: sinon.stub(),
        };
        testExecutor = {
            executeClassTests: sinon.stub(),
        };
        classDiscoverer.discoverClasses.returns([]);
        fixtureValidator.validateFixtures.returns(null);
        testExecutor.executeClassTests.returns({
            passes: [],
            failures: [],
            skips: [],
        });

        runner = new Runner(
            scanner,
            classDiscoverer,
            fixtureValidator,
            testExecutor,
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('run()', () => {
        it('should call scanner with provided path', () => {
            const mockSourceFile = {
                fileName: '/test/file.ts',
            } as ts.SourceFile;
            scanner.scan.returns({
                program: {} as ts.Program,
                typeChecker: {} as ts.TypeChecker,
                sourceFiles: [mockSourceFile],
            });

            runner.run('/test/path');

            expect(scanner.scan.calledOnce).to.be.true;
            expect(scanner.scan.calledWith('/test/path')).to.be.true;
        });

        it('should create a test result from scanned files', () => {
            const mockSourceFile = {
                fileName: '/test/file.ts',
            } as ts.SourceFile;
            scanner.scan.returns({
                program: {} as ts.Program,
                typeChecker: {} as ts.TypeChecker,
                sourceFiles: [mockSourceFile],
            });

            const result = runner.run('/test/path');

            expect(result.getPasses()).to.have.lengthOf(0);
            expect(result.getFailures()).to.have.lengthOf(0);
            expect(result.getSkips()).to.have.lengthOf(0);
            expect(result.getWarnings()).to.have.lengthOf(0);
        });

        it('should handle multiple source files', () => {
            const mockSourceFiles = [
                { fileName: '/test/file1.ts' } as ts.SourceFile,
                { fileName: '/test/file2.ts' } as ts.SourceFile,
                { fileName: '/test/file3.ts' } as ts.SourceFile,
            ];
            scanner.scan.returns({
                program: {} as ts.Program,
                typeChecker: {} as ts.TypeChecker,
                sourceFiles: mockSourceFiles,
            });

            const result = runner.run('/test/path');

            expect(result.getPasses()).to.have.lengthOf(0);
            expect(result.getFailures()).to.have.lengthOf(0);
            expect(result.getSkips()).to.have.lengthOf(0);
            expect(result.getWarnings()).to.have.lengthOf(0);
        });

        it('should handle empty source files array', () => {
            scanner.scan.returns({
                program: {} as ts.Program,
                typeChecker: {} as ts.TypeChecker,
                sourceFiles: [],
            });

            const result = runner.run('/test/path');

            expect(result.getPasses()).to.have.lengthOf(0);
            expect(result.getFailures()).to.have.lengthOf(0);
            expect(result.getSkips()).to.have.lengthOf(0);
            expect(result.getWarnings()).to.have.lengthOf(0);
        });

        it('should return TestResult instance', () => {
            scanner.scan.returns({
                program: {} as ts.Program,
                typeChecker: {} as ts.TypeChecker,
                sourceFiles: [],
            });

            const result = runner.run('/test/path');

            expect(result).to.exist;
            expect(result.getPasses).to.be.a('function');
            expect(result.getFailures).to.be.a('function');
            expect(result.getSkips).to.be.a('function');
            expect(result.getWarnings).to.be.a('function');
        });

        it('should discover classes from source files', () => {
            const mockSourceFile = {
                fileName: '/test/file.ts',
            } as ts.SourceFile;
            const mockTypeChecker = {} as ts.TypeChecker;

            scanner.scan.returns({
                program: {} as ts.Program,
                typeChecker: mockTypeChecker,
                sourceFiles: [mockSourceFile],
            });

            runner.run('/test/path');

            expect(classDiscoverer.discoverClasses.calledOnce).to.be.true;
            expect(
                classDiscoverer.discoverClasses.calledWith(
                    [mockSourceFile],
                    mockTypeChecker,
                ),
            ).to.be.true;
        });

        it('should validate fixtures for discovered classes', () => {
            const mockSourceFile = {
                fileName: '/test/file.ts',
            } as ts.SourceFile;
            const mockFixtures = [
                { getName: () => 'fixture1' },
                { getName: () => 'fixture2' },
            ];
            const mockClassInfo = {
                getName: () => 'TestClass',
                getFixtures: () => mockFixtures,
            };
            scanner.scan.returns({
                program: {} as ts.Program,
                typeChecker: {} as ts.TypeChecker,
                sourceFiles: [mockSourceFile],
            });
            classDiscoverer.discoverClasses.returns([mockClassInfo as any]);

            runner.run('/test/path');

            expect(fixtureValidator.validateFixtures.calledOnce).to.be.true;
            expect(fixtureValidator.validateFixtures).to.have.been.calledWith(
                mockFixtures,
                'TestClass',
            );
        });

        it('should add failure when fixture validation fails', () => {
            const mockSourceFile = {
                fileName: '/test/file.ts',
            } as ts.SourceFile;
            const mockClassInfo = {
                getName: () => 'TestClass',
                getFixtures: () => [],
            };
            scanner.scan.returns({
                program: {} as ts.Program,
                typeChecker: {} as ts.TypeChecker,
                sourceFiles: [mockSourceFile],
            });
            classDiscoverer.discoverClasses.returns([mockClassInfo as any]);
            fixtureValidator.validateFixtures.returns(
                'Duplicate fixture name "default" found 2 times on class "TestClass"',
            );

            const result = runner.run('/test/path');

            expect(result.getFailures()).to.have.lengthOf(1);
            expect(result.getFailures()[0].identifier).to.equal('TestClass');
            expect(result.getFailures()[0].message).to.equal(
                'Duplicate fixture name "default" found 2 times on class "TestClass"',
            );
        });

        it('should not add failure when fixture validation passes', () => {
            const mockSourceFile = {
                fileName: '/test/file.ts',
            } as ts.SourceFile;
            const mockClassInfo = {
                getName: () => 'TestClass',
                getFixtures: () => [],
            };
            scanner.scan.returns({
                program: {} as ts.Program,
                typeChecker: {} as ts.TypeChecker,
                sourceFiles: [mockSourceFile],
            });
            classDiscoverer.discoverClasses.returns([mockClassInfo as any]);
            fixtureValidator.validateFixtures.returns(null);

            const result = runner.run('/test/path');

            expect(result.getFailures()).to.have.lengthOf(0);
        });
    });
});
