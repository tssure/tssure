/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { FailResult } from './FailResult';
import { PassResult } from './PassResult';
import { SkipResult } from './SkipResult';
import { WarningResult } from './WarningResult';

/**
 * Represents the result of running verifications.
 */
export class TestResult {
    constructor(
        private readonly passes: PassResult[],
        private readonly failures: FailResult[],
        private readonly skips: SkipResult[],
        private readonly warnings: WarningResult[],
    ) {}

    /**
     * Fetches the array of passed verification results.
     */
    getPasses(): PassResult[] {
        return this.passes;
    }

    /**
     * Fetches the array of failed verification results.
     */
    getFailures(): FailResult[] {
        return this.failures;
    }

    /**
     * Fetches the array of skipped verification results.
     */
    getSkips(): SkipResult[] {
        return this.skips;
    }

    /**
     * Fetches the array of warning results.
     */
    getWarnings(): WarningResult[] {
        return this.warnings;
    }

    /**
     * Fetches the number of passed verifications.
     */
    getPassCount(): number {
        return this.passes.length;
    }

    /**
     * Fetches the number of failed verifications.
     */
    getFailCount(): number {
        return this.failures.length;
    }

    /**
     * Fetches the number of methods skipped for verification.
     */
    getSkipCount(): number {
        return this.skips.length;
    }

    /**
     * Fetches the number of warnings.
     */
    getWarnCount(): number {
        return this.warnings.length;
    }

    /**
     * Fetches whether any verifications failed.
     */
    hasFailures(): boolean {
        return this.failures.length > 0;
    }

    /**
     * Fetches the total number of verifications run.
     */
    getTotalCount(): number {
        return (
            this.passes.length +
            this.failures.length +
            this.skips.length +
            this.warnings.length
        );
    }

    /**
     * Builds a summary of the verification results.
     */
    getSummary(): string {
        let summary = `TSSure Scan Results:
  Passed: ${this.getPassCount()}
  Failed: ${this.getFailCount()}
  Warnings: ${this.getWarnCount()}
  Skipped: ${this.getSkipCount()}
  Total: ${this.getTotalCount()}
`;

        if (this.failures.length > 0) {
            summary += '\nFailures:\n';

            for (const failure of this.failures) {
                summary += `  - FAIL: ${failure.identifier} - ${failure.message}\n`;
            }
        }

        if (this.warnings.length > 0) {
            summary += '\nWarnings:\n';

            for (const warning of this.warnings) {
                summary += `  - WARN: ${warning.identifier} - ${warning.message}\n`;
            }
        }

        if (this.skips.length > 0) {
            summary += '\nSkipped:\n';

            for (const skip of this.skips) {
                summary += `  - SKIP: ${skip.identifier} - ${skip.message}\n`;
            }
        }

        return summary;
    }
}
