/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { OutputInterface } from './OutputInterface';

/**
 * Standard output abstraction.
 */
export class Output implements OutputInterface {
    constructor(private readonly stream: NodeJS.WriteStream) {}

    /**
     * @inheritDoc
     */
    write(data: string): void {
        this.stream.write(data);
    }
}
