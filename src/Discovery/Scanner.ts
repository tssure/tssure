/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { InvalidPathError } from '../Exception/InvalidPathError';
import { ScannerInterface } from './ScannerInterface';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

/**
 * Service for scanning TypeScript files and creating programs.
 */
export class Scanner implements ScannerInterface {
    /**
     * @inheritDoc
     */
    scan(scanPath: string): {
        program: ts.Program;
        typeChecker: ts.TypeChecker;
        sourceFiles: ts.SourceFile[];
    } {
        if (!fs.existsSync(scanPath)) {
            throw new InvalidPathError(`Path does not exist: ${scanPath}`);
        }

        const fileNames = this.collectTypeScriptFiles(scanPath);

        if (fileNames.length === 0) {
            throw new InvalidPathError(
                `No TypeScript files found in path: ${scanPath}`,
            );
        }

        const program = ts.createProgram(fileNames, {
            target: ts.ScriptTarget.ES2020,
            module: ts.ModuleKind.CommonJS,
            esModuleInterop: true,
        });

        const typeChecker = program.getTypeChecker();
        const sourceFiles = program
            .getSourceFiles()
            .filter(
                (sf) =>
                    !sf.isDeclarationFile && fileNames.includes(sf.fileName),
            );

        return { program, typeChecker, sourceFiles };
    }

    /**
     * Collects all TypeScript files from a path.
     */
    private collectTypeScriptFiles(scanPath: string): string[] {
        const stats = fs.statSync(scanPath);

        if (stats.isFile()) {
            if (scanPath.endsWith('.ts') && !scanPath.endsWith('.d.ts')) {
                return [path.resolve(scanPath)];
            }

            return [];
        }

        if (stats.isDirectory()) {
            const files: string[] = [];
            const entries = fs.readdirSync(scanPath);

            for (const entry of entries) {
                const fullPath = path.join(scanPath, entry);

                files.push(...this.collectTypeScriptFiles(fullPath));
            }

            return files;
        }

        return [];
    }
}
