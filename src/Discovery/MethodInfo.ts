/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { ScenarioInterface } from '../Attribute/ScenarioInterface';
import * as ts from 'typescript';

/**
 * Represents information about a discovered method.
 */
export class MethodInfo {
    constructor(
        private readonly name: string,
        private readonly scenarios: ScenarioInterface[],
        private readonly node: ts.MethodDeclaration,
        private readonly isStatic: boolean,
        private readonly skipReason: string | null = null,
    ) {}

    /**
     * Fetches the name of this method.
     */
    getName(): string {
        return this.name;
    }

    /**
     * Fetches the AST node for this method.
     */
    getNode(): ts.MethodDeclaration {
        return this.node;
    }

    /**
     * Fetches the scenarios for this method.
     */
    getScenarios(): ScenarioInterface[] {
        return this.scenarios;
    }

    /**
     * Fetches the skip reason if this method should be skipped.
     */
    getSkipReason(): string | null {
        return this.skipReason;
    }

    /**
     * Checks if this method should be skipped.
     */
    isSkipped(): boolean {
        return this.skipReason !== null;
    }

    /**
     * Checks if this method is static.
     */
    isStaticMethod(): boolean {
        return this.isStatic;
    }
}
