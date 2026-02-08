/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { ClassInfo } from './ClassInfo';
import * as ts from 'typescript';

/**
 * Interface for class discoverer service.
 */
export interface ClassDiscovererInterface {
    /**
     * Discovers all classes and their fixtures from source files.
     *
     * @param sourceFiles The source files to scan.
     * @param typeChecker The TypeScript type checker.
     * @returns Array of class information.
     */
    discoverClasses(
        sourceFiles: ts.SourceFile[],
        typeChecker: ts.TypeChecker,
    ): ClassInfo[];
}
