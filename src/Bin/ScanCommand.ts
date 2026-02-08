/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { InvalidPathError } from '../Exception/InvalidPathError';
import { OutputInterface } from '../Io/OutputInterface';
import { TestResult } from '../Runner/Result/TestResult';
import { RunnerInterface } from '../Runner/RunnerInterface';
import { ScanCommandInterface } from './ScanCommandInterface';
import * as fs from 'fs';

/**
 * CLI command for scanning and testing TypeScript files.
 */
export class ScanCommand implements ScanCommandInterface {
    constructor(
        private readonly runner: RunnerInterface,
        private readonly stdout: OutputInterface,
        private readonly stderr: OutputInterface,
    ) {}

    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    run(path: string, _options: Record<string, unknown>): TestResult | null {
        if (!fs.existsSync(path)) {
            this.stderr.write(`Error: Path "${path}" does not exist\n`);

            return null;
        }

        try {
            // Run the scan.
            const result = this.runner.run(path);

            // Print the summary.
            this.stdout.write(result.getSummary());

            return result;
        } catch (error) {
            if (error instanceof InvalidPathError) {
                this.stderr.write(`${error.message}\n`);
                return null;
            }

            throw error;
        }
    }
}
