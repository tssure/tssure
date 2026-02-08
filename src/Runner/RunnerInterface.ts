/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { TestResult } from './Result/TestResult';

/**
 * Interface for the verification runner service.
 */
export interface RunnerInterface {
    /**
     * Runs verifications for the specified path.
     *
     * @param path The path to scan and verify.
     * @returns The verification results.
     */
    run(path: string): TestResult;
}
