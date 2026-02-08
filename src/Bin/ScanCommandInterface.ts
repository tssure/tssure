/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { TestResult } from '../Runner/Result/TestResult';

/**
 * Interface for the scan command.
 */
export interface ScanCommandInterface {
    /**
     * Runs the scan command.
     *
     * @param path The path to scan.
     * @param options Command options.
     * @returns The test result, or null if there was an error.
     */
    run(path: string, options: Record<string, unknown>): TestResult | null;
}
