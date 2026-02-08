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
 * Asserts that values match their declared types.
 */
export interface TypeAsserterInterface {
    /**
     * Asserts that a value matches the expected type.
     *
     * @param value The value to check.
     * @param type The TypeScript type to check against.
     * @param typeChecker The TypeScript type checker.
     * @param classContext Optional class constructor for context (for 'this' types).
     * @throws TypeMismatchError When the value does not match the type.
     */
    assertMatches(
        value: unknown,
        type: ts.Type,
        typeChecker: ts.TypeChecker,
        classContext?: new (...args: any[]) => any,
    ): void;
}
