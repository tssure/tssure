/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { expect } from 'chai';
import { execSync } from 'child_process';
import * as path from 'path';

describe('Scan Binary Execution', function () {
    this.timeout(10000);

    const binPath = path.join(__dirname, '../../dist/tssure.js');
    const fixturesPath = path.join(__dirname, 'fixtures');

    it('should execute scan command successfully', function () {
        let exitCode: number = -1;
        let output: string = '';

        try {
            output = execSync(
                `node ${binPath} scan ${fixturesPath}`,
            ).toString();
        } catch (error: any) {
            // execSync throws on non-zero exit code.
            output = error.stdout?.toString() || '';
            exitCode = error.status || 1;
        }

        expect(exitCode).to.equal(3);
        expect(output).to.include('Passed: 15');
        expect(output).to.include('Failed: 6');
        expect(output).to.include('Skipped: 4');
        expect(output).to.include('Total: 25');
        expect(output).to.include(
            'SKIP: SkippedClass.skippedMethod - scenario for skippedMethod - Not yet implemented',
        );
        expect(output).to.include(
            'SKIP: SkippedClass.anotherSkippedMethod - scenario for anotherSkippedMethod - Skipped',
        );
        expect(output).to.include(
            'SKIP: SkippedWithTypedSure.skippedWithReason - scenario for skippedWithReason - Not yet implemented',
        );
        expect(output).to.include(
            'SKIP: SkippedWithTypedSure.skippedWithBoolean - scenario for skippedWithBoolean - Skipped',
        );
    });

    it('should handle non-existent path', function () {
        const nonExistentPath = path.join(__dirname, 'non-existent-path');

        expect(() => {
            execSync(`node ${binPath} scan ${nonExistentPath}`, {
                stdio: 'pipe',
            });
        }).to.throw();
    });

    it('should display help when no command provided', function () {
        try {
            execSync(`node ${binPath}`, { stdio: 'pipe' });
        } catch (error: any) {
            const output =
                error.stdout?.toString() || error.stderr?.toString() || '';
            expect(output).to.include('Usage');
            return;
        }

        // If no error was thrown, check that output includes Usage
        const output = execSync(`node ${binPath}`).toString();
        expect(output).to.include('Usage');
    });
});
