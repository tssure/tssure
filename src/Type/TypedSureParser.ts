/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { Expectation } from '../Attribute/Expectation';
import { Fixture } from '../Attribute/Fixture';
import { Scenario } from '../Attribute/Scenario';
import { TypedSureParserInterface } from './TypedSureParserInterface';
import * as ts from 'typescript';

/**
 * Service for parsing TypedSure type annotations to extract scenario and fixture metadata.
 */
export class TypedSureParser implements TypedSureParserInterface {
    /**
     * @inheritDoc
     */
    parseScenarios(
        node: ts.MethodDeclaration | ts.FunctionDeclaration,
        typeChecker: ts.TypeChecker,
    ): Scenario[] {
        const scenarios: Scenario[] = [];

        if (!node.type) {
            return scenarios;
        }

        const metadata = this.extractTypedSureMetadata(node.type, typeChecker);
        if (!metadata || !metadata.scenarios) {
            return scenarios;
        }

        for (const scenarioData of metadata.scenarios) {
            const data = scenarioData as Record<string, unknown>;
            scenarios.push(
                new Scenario(
                    (data.description as string | undefined) ?? null,
                    (data.args as unknown[]) ?? [],
                    data.expect ?? Expectation.TYPE_CHECK,
                    (data.instance as string | undefined) ??
                        Scenario.DEFAULT_INSTANCE,
                ),
            );
        }

        return scenarios;
    }

    /**
     * @inheritDoc
     */
    parseFixtures(
        node: ts.ConstructorDeclaration | ts.MethodDeclaration,
        typeChecker: ts.TypeChecker,
    ): Fixture[] {
        const fixtures: Fixture[] = [];

        if (!node.type) {
            return fixtures;
        }

        const metadata = this.extractTypedSureMetadata(node.type, typeChecker);
        if (!metadata || !metadata.fixtures) {
            return fixtures;
        }

        for (const fixtureData of metadata.fixtures) {
            const data = fixtureData as Record<string, unknown>;
            fixtures.push(
                new Fixture(
                    (data.name as string | undefined) ?? Fixture.DEFAULT_NAME,
                    (data.args as unknown[]) ?? [],
                    (data.description as string | undefined) ?? null,
                    data.expect ?? 'type check',
                ),
            );
        }

        return fixtures;
    }

    /**
     * @inheritDoc
     */
    parseSkip(
        node: ts.MethodDeclaration | ts.FunctionDeclaration,
        typeChecker: ts.TypeChecker,
    ): string | null {
        if (!node.type) {
            return null;
        }

        const metadata = this.extractTypedSureMetadata(node.type, typeChecker);
        if (!metadata || !metadata.skip) {
            return null;
        }

        // If skip is true, return default message
        if (metadata.skip === true) {
            return 'Skipped';
        }

        // If skip is a string, return it as the reason
        if (typeof metadata.skip === 'string') {
            return metadata.skip;
        }

        return null;
    }

    /**
     * Extracts TypedSure metadata from a type reference node.
     */
    private extractTypedSureMetadata(
        typeNode: ts.TypeNode,
        typeChecker: ts.TypeChecker,
    ): {
        scenarios?: unknown[];
        fixtures?: unknown[];
        skip?: boolean | string;
    } | null {
        // Check if this is a TypeReference to TypedSure.
        if (!ts.isTypeReferenceNode(typeNode)) {
            return null;
        }

        const typeName = typeNode.typeName;
        if (!ts.isIdentifier(typeName) || typeName.text !== 'TypedSure') {
            return null;
        }

        // TypedSure should have 2 type arguments: TypedSure<T, M>.
        if (!typeNode.typeArguments || typeNode.typeArguments.length < 2) {
            return null;
        }

        const metadataTypeNode = typeNode.typeArguments[1];

        // The metadata should be a type literal (object type).
        if (!ts.isTypeLiteralNode(metadataTypeNode)) {
            return null;
        }

        const metadata: {
            scenarios?: unknown[];
            fixtures?: unknown[];
            skip?: boolean | string;
        } = {};

        // Parse each member of the metadata type literal.
        for (const member of metadataTypeNode.members) {
            if (!ts.isPropertySignature(member) || !member.name) {
                continue;
            }

            const propertyName = (member.name as ts.Identifier).text;

            if (propertyName === 'scenarios' && member.type) {
                metadata.scenarios = this.parseArrayLiteral(
                    member.type,
                    typeChecker,
                );
            } else if (propertyName === 'fixtures' && member.type) {
                metadata.fixtures = this.parseArrayLiteral(
                    member.type,
                    typeChecker,
                );
            } else if (propertyName === 'skip' && member.type) {
                const skipValue = this.parseLiteralValue(
                    member.type,
                    typeChecker,
                );

                if (
                    typeof skipValue === 'boolean' ||
                    typeof skipValue === 'string'
                ) {
                    metadata.skip = skipValue;
                }
            }
        }

        return metadata;
    }

    /**
     * Parses an array literal type into an array of objects.
     */
    private parseArrayLiteral(
        typeNode: ts.TypeNode,
        typeChecker: ts.TypeChecker,
    ): unknown[] {
        // Check if this is a tuple type (array literal in type position).
        if (!ts.isTupleTypeNode(typeNode)) {
            return [];
        }

        const items: unknown[] = [];

        for (const element of typeNode.elements) {
            if (ts.isNamedTupleMember(element)) {
                // Handle named tuple members.
                items.push(this.parseObjectLiteral(element.type, typeChecker));
            } else {
                // Handle regular tuple elements.
                items.push(this.parseObjectLiteral(element, typeChecker));
            }
        }

        return items;
    }

    /**
     * Parses an object literal type into a plain object.
     */
    private parseObjectLiteral(
        typeNode: ts.TypeNode,
        typeChecker: ts.TypeChecker,
    ): unknown {
        if (!ts.isTypeLiteralNode(typeNode)) {
            return {};
        }

        const obj: Record<string, unknown> = {};

        for (const member of typeNode.members) {
            if (!ts.isPropertySignature(member) || !member.name) {
                continue;
            }

            const propertyName = (member.name as ts.Identifier).text;

            if (member.type) {
                obj[propertyName] = this.parseLiteralValue(
                    member.type,
                    typeChecker,
                );
            }
        }

        return obj;
    }

    /**
     * Parses a literal value from a type node.
     */
    private parseLiteralValue(
        typeNode: ts.TypeNode,
        typeChecker: ts.TypeChecker,
    ): unknown {
        // String literal.
        if (ts.isLiteralTypeNode(typeNode)) {
            const literal = typeNode.literal;

            if (ts.isStringLiteral(literal)) {
                return literal.text;
            }

            if (ts.isNumericLiteral(literal)) {
                return Number(literal.text);
            }

            if (literal.kind === ts.SyntaxKind.TrueKeyword) {
                return true;
            }

            if (literal.kind === ts.SyntaxKind.FalseKeyword) {
                return false;
            }

            if (literal.kind === ts.SyntaxKind.NullKeyword) {
                return null;
            }
        }

        // Array literal (tuple type).
        if (ts.isTupleTypeNode(typeNode)) {
            const array: unknown[] = [];

            for (const element of typeNode.elements) {
                if (ts.isNamedTupleMember(element)) {
                    array.push(
                        this.parseLiteralValue(element.type, typeChecker),
                    );
                } else {
                    array.push(this.parseLiteralValue(element, typeChecker));
                }
            }

            return array;
        }

        // Object literal (type literal).
        if (ts.isTypeLiteralNode(typeNode)) {
            return this.parseObjectLiteral(typeNode, typeChecker);
        }

        // Default: return undefined for unparseable types.
        return undefined;
    }
}
