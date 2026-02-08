/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { Fixture } from '../Attribute/Fixture';
import { Scenario } from '../Attribute/Scenario';
import * as ts from 'typescript';

/**
 * Interface for parsing JSDoc annotations.
 */
export interface JSDocParserInterface {
    /**
     * Parses fixture metadata from JSDoc annotations on a constructor or factory method.
     *
     * @param node The constructor or method declaration node.
     * @param typeChecker The TypeScript type checker.
     * @returns Array of parsed fixtures.
     */
    parseFixtures(
        node: ts.ConstructorDeclaration | ts.MethodDeclaration,
        typeChecker: ts.TypeChecker,
    ): Fixture[];

    /**
     * Parses scenario metadata from JSDoc annotations on a method or function.
     *
     * @param node The method or function declaration node.
     * @param typeChecker The TypeScript type checker.
     * @returns Array of parsed scenarios.
     */
    parseScenarios(
        node: ts.MethodDeclaration | ts.FunctionDeclaration,
        typeChecker: ts.TypeChecker,
    ): Scenario[];

    /**
     * Parses skip metadata from JSDoc annotations.
     *
     * @param node The method or function declaration node.
     * @param typeChecker The TypeScript type checker.
     * @returns Skip reason string if the test should be skipped, null otherwise.
     */
    parseSkip(
        node: ts.MethodDeclaration | ts.FunctionDeclaration,
        typeChecker: ts.TypeChecker,
    ): string | null;
}
