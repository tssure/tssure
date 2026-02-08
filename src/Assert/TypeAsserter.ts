/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { TypeMismatchError } from '../Exception/TypeMismatchError';
import { UnsupportedTypeError } from '../Exception/UnsupportedTypeError';
import { TypeAsserterInterface } from './TypeAsserterInterface';
import * as ts from 'typescript';

/**
 * Asserts that values match their declared types.
 */
export class TypeAsserter implements TypeAsserterInterface {
    /**
     * @inheritDoc
     */
    assertMatches(
        value: unknown,
        type: ts.Type,
        typeChecker: ts.TypeChecker,
        classContext?: new (...args: any[]) => any,
    ): void {
        const typeString = typeChecker.typeToString(type);

        // Handle null and undefined.
        if (value === null || value === undefined) {
            if (
                type.flags & ts.TypeFlags.Null ||
                type.flags & ts.TypeFlags.Undefined ||
                type.flags & ts.TypeFlags.Void ||
                type.flags & ts.TypeFlags.Any
            ) {
                return;
            }

            // Check for union types that include null/undefined.
            if (type.isUnion()) {
                for (const unionType of type.types) {
                    if (
                        unionType.flags & ts.TypeFlags.Null ||
                        unionType.flags & ts.TypeFlags.Undefined
                    ) {
                        return;
                    }
                }
            }

            throw new TypeMismatchError(
                `Expected ${typeString}, got ${value}`,
                typeString,
                value,
            );
        }

        // Handle 'any' type.
        if (type.flags & ts.TypeFlags.Any) {
            // We have no specific type to compare against, but we're still adding value
            // as we'll be ensuring the method call did not throw.
            return;
        }

        // Handle primitive types.
        if (type.flags & ts.TypeFlags.String) {
            if (typeof value !== 'string') {
                throw new TypeMismatchError(
                    `Expected string, got ${typeof value}`,
                    typeString,
                    value,
                );
            }

            return;
        }

        if (type.flags & ts.TypeFlags.Number) {
            if (typeof value !== 'number') {
                throw new TypeMismatchError(
                    `Expected number, got ${typeof value}`,
                    typeString,
                    value,
                );
            }

            return;
        }

        if (type.flags & ts.TypeFlags.Boolean) {
            if (typeof value !== 'boolean') {
                throw new TypeMismatchError(
                    `Expected boolean, got ${typeof value}`,
                    typeString,
                    value,
                );
            }

            return;
        }

        // Handle union types.
        if (type.isUnion()) {
            for (const unionType of type.types) {
                try {
                    this.assertMatches(
                        value,
                        unionType,
                        typeChecker,
                        classContext,
                    );

                    return; // If any union member matches, we're good.
                } catch {
                    // Continue to next union member.
                }
            }

            throw new TypeMismatchError(
                `Value does not match any type in union ${typeString}`,
                typeString,
                value,
            );
        }

        // Handle intersection types.
        if (type.isIntersection()) {
            for (const intersectionType of type.types) {
                this.assertMatches(
                    value,
                    intersectionType,
                    typeChecker,
                    classContext,
                );
            }

            return;
        }

        // Handle object types (classes, interfaces, etc.).
        if (type.flags & ts.TypeFlags.Object) {
            if (typeof value !== 'object' || value === null) {
                throw new TypeMismatchError(
                    `Expected object, got ${typeof value}`,
                    typeString,
                    value,
                );
            }

            // For class types, check instanceof if we have a class context.
            const objectType = type as ts.ObjectType;

            if (objectType.symbol) {
                const symbolName = objectType.symbol.getName();

                // Handle 'this' type.
                if (symbolName === '__type' && classContext) {
                    if (!(value instanceof classContext)) {
                        throw new TypeMismatchError(
                            `Expected instance of ${classContext.name}, got ${value.constructor.name}`,
                            typeString,
                            value,
                        );
                    }

                    return;
                }

                // For other class types, we'd need runtime class reference.
                // This is a limitation of TypeScript's type system at runtime.
                // For now, we just check that it's an object.
                //
                // TODO: See if there is some partial matching we can do via instanceof/prototype checking etc.
            }

            return;
        }

        // If we get here, we have an unsupported type.
        throw new UnsupportedTypeError(
            `Unsupported type for runtime validation: ${typeString}`,
        );
    }
}
