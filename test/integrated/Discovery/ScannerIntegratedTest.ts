/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { Scanner } from '../../../src/Discovery/Scanner';
import { InvalidPathError } from '../../../src/Exception/InvalidPathError';
import { expect } from 'chai';
import sinon from 'sinon';

describe('Scanner Integrated', () => {
    let scanner: Scanner;

    beforeEach(() => {
        scanner = new Scanner();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('scan()', () => {
        it('should throw InvalidPathError when path does not exist', () => {
            expect(() =>
                scanner.scan('/nonexistent/path/that/does/not/exist'),
            ).to.throw(InvalidPathError, 'Path does not exist');
        });

        it('should scan a single TypeScript file', function () {
            this.timeout(5000); // Increase timeout for TypeScript compilation

            const result = scanner.scan(__filename);

            expect(result.program).to.exist;
            expect(result.typeChecker).to.exist;
            expect(result.sourceFiles).to.be.an('array');
            expect(result.sourceFiles.length).to.be.greaterThan(0);
        });

        it('should scan a directory recursively', function () {
            this.timeout(5000); // Increase timeout for TypeScript compilation

            const testDir = __dirname;

            const result = scanner.scan(testDir);

            expect(result.program).to.exist;
            expect(result.typeChecker).to.exist;
            expect(result.sourceFiles).to.be.an('array');
            expect(result.sourceFiles.length).to.be.greaterThan(0);
        });
    });
});
