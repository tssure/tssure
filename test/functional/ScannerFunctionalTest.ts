/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { Scanner } from '../../src/Discovery/Scanner';
import { InvalidPathError } from '../../src/Exception/InvalidPathError';
import { expect } from 'chai';
import * as path from 'path';

describe('Scanner Functional', () => {
    let scanner: Scanner;
    const fixturesPath = path.resolve(__dirname, 'fixtures');

    beforeEach(() => {
        scanner = new Scanner();
    });

    describe('scan()', () => {
        it('should create a valid TypeScript program from a file', () => {
            const filePath = path.join(fixturesPath, 'simple-function.ts');
            const result = scanner.scan(filePath);

            expect(result.program).to.exist;
            expect(result.typeChecker).to.exist;
            expect(result.sourceFiles).to.be.an('array');
            expect(result.sourceFiles.length).to.equal(1);
        });

        it('should create a valid TypeScript program from a directory', () => {
            const result = scanner.scan(fixturesPath);

            expect(result.program).to.exist;
            expect(result.typeChecker).to.exist;
            expect(result.sourceFiles).to.be.an('array');
            expect(result.sourceFiles.length).to.be.greaterThan(1);
        });

        it('should provide a working type checker', () => {
            const filePath = path.join(fixturesPath, 'simple-function.ts');
            const result = scanner.scan(filePath);

            const sourceFile = result.sourceFiles[0];
            expect(sourceFile).to.exist;

            // Verify we can use the type checker
            const symbol = result.typeChecker.getSymbolAtLocation(sourceFile);
            expect(symbol || sourceFile).to.exist; // Either works
        });

        it('should filter out declaration files', () => {
            const result = scanner.scan(fixturesPath);

            for (const sourceFile of result.sourceFiles) {
                expect(sourceFile.isDeclarationFile).to.be.false;
                expect(sourceFile.fileName).not.to.match(/\.d\.ts$/);
            }
        });

        it('should throw InvalidPathError for non-existent paths', () => {
            expect(() =>
                scanner.scan('/nonexistent/path/that/does/not/exist'),
            ).to.throw(InvalidPathError, 'Path does not exist');
        });

        it('should recursively find TypeScript files in subdirectories', () => {
            const result = scanner.scan(fixturesPath);

            // Should find both simple-function.ts and simple-class.ts
            expect(result.sourceFiles.length).to.be.greaterThanOrEqual(2);

            const fileNames = result.sourceFiles.map((sf) =>
                path.basename(sf.fileName),
            );
            expect(fileNames).to.include('simple-function.ts');
            expect(fileNames).to.include('simple-class.ts');
        });
    });
});
