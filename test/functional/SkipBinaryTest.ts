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

describe('Skip Binary Execution Tests', function () {
    this.timeout(10000);

    const binPath = path.join(__dirname, '../../dist/tssure.js');

    describe('JSDoc @skip annotation', () => {
        it('should show skip count in binary output for JSDoc skipped tests', function () {
            const fixturePath = path.join(
                __dirname,
                'fixtures/SkippedClass.ts',
            );
            let output: string = '';

            try {
                output = execSync(
                    `node ${binPath} scan ${fixturePath}`,
                ).toString();
            } catch (error: any) {
                // execSync throws on non-zero exit code.
                output = error.stdout?.toString() || '';
            }

            // Should show 2 skipped tests.
            expect(output).to.include('Skipped: 2');
            expect(output).to.include('Passed: 1');
            expect(output).to.include('Failed: 0');
        });

        it('should show skip details in binary output for JSDoc skipped tests', function () {
            const fixturePath = path.join(
                __dirname,
                'fixtures/SkippedClass.ts',
            );
            let output: string = '';

            try {
                output = execSync(
                    `node ${binPath} scan ${fixturePath}`,
                ).toString();
            } catch (error: any) {
                output = error.stdout?.toString() || '';
            }

            // Should show skip details.
            expect(output).to.include('SKIP: SkippedClass.skippedMethod');
            expect(output).to.include('Not yet implemented');
            expect(output).to.include(
                'SKIP: SkippedClass.anotherSkippedMethod',
            );
            expect(output).to.include('Skipped');
        });
    });

    describe('TypedSure skip annotation', () => {
        it('should show skip count in binary output for TypedSure skipped tests', function () {
            const fixturePath = path.join(
                __dirname,
                'fixtures/SkippedWithTypedSure.ts',
            );
            let output: string = '';

            try {
                output = execSync(
                    `node ${binPath} scan ${fixturePath}`,
                ).toString();
            } catch (error: any) {
                output = error.stdout?.toString() || '';
            }

            // Should show 2 skipped tests.
            expect(output).to.include('Skipped: 2');
            expect(output).to.include('Passed: 1');
            expect(output).to.include('Failed: 0');
        });

        it('should show skip details in binary output for TypedSure skipped tests', function () {
            const fixturePath = path.join(
                __dirname,
                'fixtures/SkippedWithTypedSure.ts',
            );
            let output: string = '';

            try {
                output = execSync(
                    `node ${binPath} scan ${fixturePath}`,
                ).toString();
            } catch (error: any) {
                output = error.stdout?.toString() || '';
            }

            // Should show skip details.
            expect(output).to.include(
                'SKIP: SkippedWithTypedSure.skippedWithReason',
            );
            expect(output).to.include('Not yet implemented');
            expect(output).to.include(
                'SKIP: SkippedWithTypedSure.skippedWithBoolean',
            );
            expect(output).to.include('Skipped');
        });
    });

    describe('Combined skip output', () => {
        it('should show correct skip count when scanning multiple files', function () {
            const fixturesPath = path.join(__dirname, 'fixtures');
            let output: string = '';

            try {
                output = execSync(
                    `node ${binPath} scan ${fixturesPath}`,
                ).toString();
            } catch (error: any) {
                output = error.stdout?.toString() || '';
            }

            // Should show skipped tests from both JSDoc and TypedSure approaches.
            // SkippedClass has 2 skips, SkippedWithTypedSure has 2 skips = 4 total.
            expect(output).to.include('Skipped: 4');
        });
    });
});
