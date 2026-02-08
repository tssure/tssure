/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { FixtureInterface } from '../Attribute/FixtureInterface';
import { MethodInfo } from './MethodInfo';
import * as ts from 'typescript';

/**
 * Represents information about a discovered class.
 */
export class ClassInfo {
    constructor(
        private readonly name: string,
        private readonly fixtures: FixtureInterface[],
        private readonly methods: MethodInfo[],
        private readonly node: ts.ClassDeclaration,
    ) {}

    /**
     * Fetches the fixtures for this class.
     */
    getFixtures(): FixtureInterface[] {
        return this.fixtures;
    }

    /**
     * Fetches the methods for this class.
     */
    getMethods(): MethodInfo[] {
        return this.methods;
    }

    /**
     * Fetches the name of this class.
     */
    getName(): string {
        return this.name;
    }

    /**
     * Fetches the AST node for this class.
     */
    getNode(): ts.ClassDeclaration {
        return this.node;
    }
}
