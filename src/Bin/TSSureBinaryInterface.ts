/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Interface for the TSSure binary.
 */
export interface TSSureBinaryInterface {
    /**
     * Runs the binary with the given arguments.
     *
     * @param args Command line arguments.
     * @returns Exit code.
     */
    run(args: string[]): number;
}
