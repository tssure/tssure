/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import * as ts from 'typescript';

/**
 * Interface for the scanner service.
 */
export interface ScannerInterface {
    /**
     * Scans a path for TypeScript files and creates a program.
     *
     * @param path The path to scan (file or directory).
     * @returns The TypeScript program and type checker.
     */
    scan(path: string): {
        program: ts.Program;
        typeChecker: ts.TypeChecker;
        sourceFiles: ts.SourceFile[];
    };
}
