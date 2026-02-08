/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { TypedSureParser } from '../../../src/Type/TypedSureParser';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as ts from 'typescript';

describe('TypedSureParser', () => {
    let parser: TypedSureParser;
    let typeChecker: sinon.SinonStubbedInstance<ts.TypeChecker> &
        ts.TypeChecker;

    beforeEach(() => {
        typeChecker = sinon.createStubInstance(
            Object as any,
        ) as sinon.SinonStubbedInstance<ts.TypeChecker> & ts.TypeChecker;

        parser = new TypedSureParser();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('parseScenarios()', () => {
        it('should return empty array when node has no type annotation', () => {
            const node = {
                type: undefined,
            } as ts.MethodDeclaration;

            const scenarios = parser.parseScenarios(node, typeChecker);

            expect(scenarios).to.be.an('array').that.is.empty;
        });

        it('should return empty array when type is not a TypeReference', () => {
            const node = {
                type: {
                    kind: ts.SyntaxKind.NumberKeyword,
                } as ts.TypeNode,
            } as unknown as ts.MethodDeclaration;

            const scenarios = parser.parseScenarios(node, typeChecker);

            expect(scenarios).to.be.an('array').that.is.empty;
        });

        it('should return empty array when TypeReference is not TypedSure', () => {
            const node = {
                type: {
                    kind: ts.SyntaxKind.TypeReference,
                    typeName: {
                        kind: ts.SyntaxKind.Identifier,
                        text: 'SomeOtherType',
                    } as ts.Identifier,
                } as unknown as ts.TypeReferenceNode,
            } as unknown as ts.MethodDeclaration;

            const scenarios = parser.parseScenarios(node, typeChecker);

            expect(scenarios).to.be.an('array').that.is.empty;
        });

        it('should return empty array when TypedSure has no metadata', () => {
            const node = {
                type: {
                    kind: ts.SyntaxKind.TypeReference,
                    typeName: {
                        kind: ts.SyntaxKind.Identifier,
                        text: 'TypedSure',
                    } as ts.Identifier,
                    typeArguments: [
                        { kind: ts.SyntaxKind.NumberKeyword } as ts.TypeNode,
                    ],
                } as unknown as ts.TypeReferenceNode,
            } as unknown as ts.MethodDeclaration;

            const scenarios = parser.parseScenarios(node, typeChecker);

            expect(scenarios).to.be.an('array').that.is.empty;
        });

        it('should return empty array when metadata has no scenarios property', () => {
            const node = {
                type: {
                    kind: ts.SyntaxKind.TypeReference,
                    typeName: {
                        kind: ts.SyntaxKind.Identifier,
                        text: 'TypedSure',
                    } as ts.Identifier,
                    typeArguments: [
                        { kind: ts.SyntaxKind.NumberKeyword } as ts.TypeNode,
                        {
                            kind: ts.SyntaxKind.TypeLiteral,
                            members: [],
                        } as unknown as ts.TypeLiteralNode,
                    ],
                } as unknown as ts.TypeReferenceNode,
            } as unknown as ts.MethodDeclaration;

            const scenarios = parser.parseScenarios(node, typeChecker);

            expect(scenarios).to.be.an('array').that.is.empty;
        });
    });

    describe('parseFixtures()', () => {
        it('should return empty array when node has no type annotation', () => {
            const node = {
                type: undefined,
            } as ts.ConstructorDeclaration;

            const fixtures = parser.parseFixtures(node, typeChecker);

            expect(fixtures).to.be.an('array').that.is.empty;
        });

        it('should return empty array when type is not a TypeReference', () => {
            const node = {
                type: {
                    kind: ts.SyntaxKind.VoidKeyword,
                } as ts.TypeNode,
            } as unknown as ts.ConstructorDeclaration;

            const fixtures = parser.parseFixtures(node, typeChecker);

            expect(fixtures).to.be.an('array').that.is.empty;
        });

        it('should return empty array when TypeReference is not TypedSure', () => {
            const node = {
                type: {
                    kind: ts.SyntaxKind.TypeReference,
                    typeName: {
                        kind: ts.SyntaxKind.Identifier,
                        text: 'SomeOtherType',
                    } as ts.Identifier,
                } as unknown as ts.TypeReferenceNode,
            } as unknown as ts.ConstructorDeclaration;

            const fixtures = parser.parseFixtures(node, typeChecker);

            expect(fixtures).to.be.an('array').that.is.empty;
        });

        it('should return empty array when metadata has no fixtures property', () => {
            const node = {
                type: {
                    kind: ts.SyntaxKind.TypeReference,
                    typeName: {
                        kind: ts.SyntaxKind.Identifier,
                        text: 'TypedSure',
                    } as ts.Identifier,
                    typeArguments: [
                        { kind: ts.SyntaxKind.VoidKeyword } as ts.TypeNode,
                        {
                            kind: ts.SyntaxKind.TypeLiteral,
                            members: [],
                        } as unknown as ts.TypeLiteralNode,
                    ],
                } as unknown as ts.TypeReferenceNode,
            } as unknown as ts.ConstructorDeclaration;

            const fixtures = parser.parseFixtures(node, typeChecker);

            expect(fixtures).to.be.an('array').that.is.empty;
        });
    });

    describe('parseSkip()', () => {
        it('should return null when node has no type annotation', () => {
            const node = {
                type: undefined,
            } as ts.MethodDeclaration;

            const skipReason = parser.parseSkip(node, typeChecker);

            expect(skipReason).to.be.null;
        });

        it('should return null when type is not a TypeReference', () => {
            const node = {
                type: {
                    kind: ts.SyntaxKind.NumberKeyword,
                } as ts.TypeNode,
            } as unknown as ts.MethodDeclaration;

            const skipReason = parser.parseSkip(node, typeChecker);

            expect(skipReason).to.be.null;
        });

        it('should return null when TypeReference is not TypedSure', () => {
            const node = {
                type: {
                    kind: ts.SyntaxKind.TypeReference,
                    typeName: {
                        kind: ts.SyntaxKind.Identifier,
                        text: 'SomeOtherType',
                    } as ts.Identifier,
                } as unknown as ts.TypeReferenceNode,
            } as unknown as ts.MethodDeclaration;

            const skipReason = parser.parseSkip(node, typeChecker);

            expect(skipReason).to.be.null;
        });

        it('should return null when metadata has no skip property', () => {
            const node = {
                type: {
                    kind: ts.SyntaxKind.TypeReference,
                    typeName: {
                        kind: ts.SyntaxKind.Identifier,
                        text: 'TypedSure',
                    } as ts.Identifier,
                    typeArguments: [
                        { kind: ts.SyntaxKind.NumberKeyword } as ts.TypeNode,
                        {
                            kind: ts.SyntaxKind.TypeLiteral,
                            members: [],
                        } as unknown as ts.TypeLiteralNode,
                    ],
                } as unknown as ts.TypeReferenceNode,
            } as unknown as ts.MethodDeclaration;

            const skipReason = parser.parseSkip(node, typeChecker);

            expect(skipReason).to.be.null;
        });

        it('should return null when skip property is false', () => {
            const node = {
                type: {
                    kind: ts.SyntaxKind.TypeReference,
                    typeName: {
                        kind: ts.SyntaxKind.Identifier,
                        text: 'TypedSure',
                    } as ts.Identifier,
                    typeArguments: [
                        { kind: ts.SyntaxKind.NumberKeyword } as ts.TypeNode,
                        {
                            kind: ts.SyntaxKind.TypeLiteral,
                            members: [],
                        } as unknown as ts.TypeLiteralNode,
                    ],
                } as unknown as ts.TypeReferenceNode,
            } as unknown as ts.MethodDeclaration;

            const skipReason = parser.parseSkip(node, typeChecker);

            expect(skipReason).to.be.null;
        });
    });
});
