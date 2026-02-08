/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { ScanCommand } from '../../../src/Bin/ScanCommand';
import { InvalidPathError } from '../../../src/Exception/InvalidPathError';
import { OutputInterface } from '../../../src/Io/OutputInterface';
import { TestResult } from '../../../src/Runner/Result/TestResult';
import { RunnerInterface } from '../../../src/Runner/RunnerInterface';
import { expect } from 'chai';
import sinon from 'sinon';

describe('ScanCommand', () => {
    let runner: sinon.SinonStubbedInstance<RunnerInterface>;
    let stdout: sinon.SinonStubbedInstance<OutputInterface>;
    let stderr: sinon.SinonStubbedInstance<OutputInterface>;
    let scanCommand: ScanCommand;

    beforeEach(() => {
        runner = {
            run: sinon.stub(),
        };
        stdout = {
            write: sinon.stub(),
        };
        stderr = {
            write: sinon.stub(),
        };

        scanCommand = new ScanCommand(runner, stdout, stderr);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('run()', () => {
        it('should write error when path does not exist', () => {
            const result = scanCommand.run(
                '/nonexistent/path/that/does/not/exist',
                {},
            );

            expect(result).to.be.null;
            expect(stderr.write.calledOnce).to.be.true;
            expect(stderr.write.firstCall.args[0]).to.include('does not exist');
        });

        it('should run the runner when path exists', () => {
            const testResult = new TestResult([], [], [], []);
            runner.run.returns(testResult);

            scanCommand.run(__filename, {});

            expect(runner.run.calledOnce).to.be.true;
            expect(runner.run.calledWith(__filename)).to.be.true;
        });

        it('should write summary to stdout', () => {
            const testResult = new TestResult([], [], [], []);
            runner.run.returns(testResult);

            scanCommand.run(__filename, {});

            expect(stdout.write.calledOnce).to.be.true;
            expect(stdout.write.firstCall.args[0]).to.include(
                'TSSure Scan Results',
            );
        });

        it('should return the test result', () => {
            const testResult = new TestResult([], [], [], []);
            runner.run.returns(testResult);

            const result = scanCommand.run(__filename, {});

            expect(result).to.equal(testResult);
        });

        it('should handle InvalidPathError from runner', () => {
            runner.run.throws(new InvalidPathError('Invalid path'));

            const result = scanCommand.run(__filename, {});

            expect(result).to.be.null;
            expect(stderr.write.calledOnce).to.be.true;
            expect(stderr.write.calledWith('Invalid path\n')).to.be.true;
        });

        it('should rethrow other errors', () => {
            runner.run.throws(new Error('Unexpected error'));

            expect(() => scanCommand.run(__filename, {})).to.throw(
                'Unexpected error',
            );
        });
    });
});
