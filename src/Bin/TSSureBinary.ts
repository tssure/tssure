/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { OutputInterface } from '../Io/OutputInterface';
import { ScanCommandInterface } from './ScanCommandInterface';
import { TSSureBinaryInterface } from './TSSureBinaryInterface';

/**
 * Main binary for TSSure CLI.
 */
export class TSSureBinary implements TSSureBinaryInterface {
    constructor(
        private readonly scanCommand: ScanCommandInterface,
        private readonly stdout: OutputInterface,
        private readonly stderr: OutputInterface,
    ) {}

    /**
     * @inheritDoc
     */
    run(args: string[]): number {
        const [, , command, ...rest] = args;

        if (!command) {
            this.stderr.write('Usage: tssure <command> [options]\n');
            this.stderr.write('Commands:\n');
            this.stderr.write(
                '  scan <path>  Scan and test TypeScript files\n',
            );
            return 1;
        }

        if (command === 'scan') {
            const [path] = rest;

            if (!path) {
                this.stderr.write('Error: scan command requires a path\n');
                this.stderr.write('Usage: tssure scan <path>\n');
                return 1;
            }

            const result = this.scanCommand.run(path, {});

            if (result === null) {
                return 1;
            }

            return result.hasFailures() ? 3 : 0;
        }

        this.stderr.write(`Unknown command: ${command}\n`);
        return 1;
    }
}
