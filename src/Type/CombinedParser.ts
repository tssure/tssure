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
import { JSDocParserInterface } from './JSDocParserInterface';
import { TypedSureParserInterface } from './TypedSureParserInterface';
import * as ts from 'typescript';

/**
 * Combined parser that supports both JSDoc and type-based TypedSure annotation styles.
 */
export class CombinedParser implements TypedSureParserInterface {
    constructor(
        private readonly jsDocParser: JSDocParserInterface,
        private readonly typedSureParser: TypedSureParserInterface,
    ) {}

    /**
     * @inheritDoc
     */
    parseFixtures(
        node: ts.ConstructorDeclaration | ts.MethodDeclaration,
        typeChecker: ts.TypeChecker,
    ): Fixture[] {
        // Parse from both sources and merge.
        const jsDocFixtures = this.jsDocParser.parseFixtures(node, typeChecker);
        const typedSureFixtures = this.typedSureParser.parseFixtures(
            node,
            typeChecker,
        );

        return [...jsDocFixtures, ...typedSureFixtures];
    }

    /**
     * @inheritDoc
     */
    parseScenarios(
        node: ts.MethodDeclaration | ts.FunctionDeclaration,
        typeChecker: ts.TypeChecker,
    ): Scenario[] {
        // Parse from both sources and merge.
        const jsDocScenarios = this.jsDocParser.parseScenarios(
            node,
            typeChecker,
        );
        const typedSureScenarios = this.typedSureParser.parseScenarios(
            node,
            typeChecker,
        );

        return [...jsDocScenarios, ...typedSureScenarios];
    }

    /**
     * @inheritDoc
     */
    parseSkip(
        node: ts.MethodDeclaration | ts.FunctionDeclaration,
        typeChecker: ts.TypeChecker,
    ): string | null {
        // JSDoc takes precedence over TypedSure for skip.
        const jsDocSkip = this.jsDocParser.parseSkip(node, typeChecker);

        if (jsDocSkip !== null) {
            return jsDocSkip;
        }

        return this.typedSureParser.parseSkip(node, typeChecker);
    }
}
