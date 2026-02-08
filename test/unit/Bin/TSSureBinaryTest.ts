/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { ScanCommandInterface } from '../../../src/Bin/ScanCommandInterface';
import { TSSureBinary } from '../../../src/Bin/TSSureBinary';
import { OutputInterface } from '../../../src/Io/OutputInterface';
import { FailResult } from '../../../src/Runner/Result/FailResult';
import { TestResult } from '../../../src/Runner/Result/TestResult';
import { expect } from 'chai';
import sinon from 'sinon';

describe('TSSureBinary', () => {
    let scanCommand: sinon.SinonStubbedInstance<ScanCommandInterface>;
    let stdout: sinon.SinonStubbedInstance<OutputInterface>;
    let stderr: sinon.SinonStubbedInstance<OutputInterface>;
    let binary: TSSureBinary;

    beforeEach(() => {
        scanCommand = {
            run: sinon.stub(),
        };
        stdout = {
            write: sinon.stub(),
        };
        stderr = {
            write: sinon.stub(),
        };

        binary = new TSSureBinary(scanCommand, stdout, stderr);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('run()', () => {
        it('should show usage when no command provided', () => {
            const exitCode = binary.run(['node', 'tssure']);

            expect(exitCode).to.equal(1);
            expect(stderr.write.called).to.be.true;
            expect(stderr.write.firstCall.args[0]).to.include('Usage:');
        });

        it('should show error when scan command has no path', () => {
            const exitCode = binary.run(['node', 'tssure', 'scan']);

            expect(exitCode).to.equal(1);
            expect(stderr.write.called).to.be.true;
            expect(stderr.write.firstCall.args[0]).to.include(
                'scan command requires a path',
            );
        });

        it('should run scan command with provided path', () => {
            const testResult = new TestResult([], [], [], []);
            scanCommand.run.returns(testResult);

            binary.run(['node', 'tssure', 'scan', '/path/to/test']);

            expect(scanCommand.run.calledOnce).to.be.true;
            expect(scanCommand.run.calledWith('/path/to/test', {})).to.be.true;
        });

        it('should return exit code 0 when tests pass', () => {
            const testResult = new TestResult([], [], [], []);
            scanCommand.run.returns(testResult);

            const exitCode = binary.run([
                'node',
                'tssure',
                'scan',
                '/path/to/test',
            ]);

            expect(exitCode).to.equal(0);
        });

        it('should return exit code 3 when tests fail', () => {
            const testResult = new TestResult(
                [],
                [new FailResult('test', 'error')],
                [],
                [],
            );
            scanCommand.run.returns(testResult);

            const exitCode = binary.run([
                'node',
                'tssure',
                'scan',
                '/path/to/test',
            ]);

            expect(exitCode).to.equal(3);
        });

        it('should return exit code 1 when scan command returns null', () => {
            scanCommand.run.returns(null);

            const exitCode = binary.run([
                'node',
                'tssure',
                'scan',
                '/path/to/test',
            ]);

            expect(exitCode).to.equal(1);
        });

        it('should show error for unknown command', () => {
            const exitCode = binary.run(['node', 'tssure', 'unknown']);

            expect(exitCode).to.equal(1);
            expect(stderr.write.called).to.be.true;
            expect(stderr.write.firstCall.args[0]).to.include(
                'Unknown command',
            );
        });
    });
});
