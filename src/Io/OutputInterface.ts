/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Interface for output streams.
 */
export interface OutputInterface {
    /**
     * Writes data to the output stream.
     */
    write(data: string): void;
}
