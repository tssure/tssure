/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { TypeAsserter } from '../../src/Assert/TypeAsserter';
import { Scanner } from '../../src/Discovery/Scanner';
import { TypeMismatchError } from '../../src/Exception/TypeMismatchError';
import { expect } from 'chai';
import * as path from 'path';
import * as ts from 'typescript';

describe('TypeAsserter Functional', () => {
    let typeAsserter: TypeAsserter;
    let scanner: Scanner;
    const fixturesPath = path.resolve(__dirname, 'fixtures');

    beforeEach(() => {
        typeAsserter = new TypeAsserter();
        scanner = new Scanner();
    });

    describe('assertMatches() with real TypeScript types', function () {
        this.timeout(10000);

        it('should validate number type from actual TypeScript code', () => {
            const filePath = path.join(fixturesPath, 'simple-function.ts');
            const { typeChecker, sourceFiles } = scanner.scan(filePath);

            const sourceFile = sourceFiles[0];

            // Find the 'add' function
            let addFunction: ts.FunctionDeclaration | undefined;
            ts.forEachChild(sourceFile, (node) => {
                if (
                    ts.isFunctionDeclaration(node) &&
                    node.name?.text === 'add'
                ) {
                    addFunction = node;
                }
            });

            expect(addFunction).to.exist;

            // Get the return type of the function
            const signature = typeChecker.getSignatureFromDeclaration(
                addFunction!,
            );
            expect(signature).to.exist;

            const returnType = typeChecker.getReturnTypeOfSignature(signature!);

            // Should accept a number
            expect(() =>
                typeAsserter.assertMatches(42, returnType, typeChecker),
            ).not.to.throw();

            // Should reject a string
            expect(() =>
                typeAsserter.assertMatches('42', returnType, typeChecker),
            ).to.throw(TypeMismatchError);
        });

        it('should validate string type from actual TypeScript code', () => {
            const filePath = path.join(fixturesPath, 'simple-function.ts');
            const { typeChecker, sourceFiles } = scanner.scan(filePath);

            const sourceFile = sourceFiles[0];

            // Find the 'greet' function
            let greetFunction: ts.FunctionDeclaration | undefined;
            ts.forEachChild(sourceFile, (node) => {
                if (
                    ts.isFunctionDeclaration(node) &&
                    node.name?.text === 'greet'
                ) {
                    greetFunction = node;
                }
            });

            expect(greetFunction).to.exist;

            const signature = typeChecker.getSignatureFromDeclaration(
                greetFunction!,
            );
            const returnType = typeChecker.getReturnTypeOfSignature(signature!);

            // Should accept a string
            expect(() =>
                typeAsserter.assertMatches('Hello!', returnType, typeChecker),
            ).not.to.throw();

            // Should reject a number
            expect(() =>
                typeAsserter.assertMatches(42, returnType, typeChecker),
            ).to.throw(TypeMismatchError);
        });

        it('should validate union type from actual TypeScript code', () => {
            const filePath = path.join(fixturesPath, 'simple-function.ts');
            const { typeChecker, sourceFiles } = scanner.scan(filePath);

            const sourceFile = sourceFiles[0];

            // Find the 'processValue' function
            let processValueFunction: ts.FunctionDeclaration | undefined;
            ts.forEachChild(sourceFile, (node) => {
                if (
                    ts.isFunctionDeclaration(node) &&
                    node.name?.text === 'processValue'
                ) {
                    processValueFunction = node;
                }
            });

            expect(processValueFunction).to.exist;

            // Get the first parameter type (string | number)
            const parameters = processValueFunction!.parameters;
            expect(parameters.length).to.be.greaterThan(0);

            const paramType = typeChecker.getTypeAtLocation(parameters[0]);

            // Should accept a string.
            expect(() =>
                typeAsserter.assertMatches('test', paramType, typeChecker),
            ).not.to.throw();

            // Should accept a number.
            expect(() =>
                typeAsserter.assertMatches(42, paramType, typeChecker),
            ).not.to.throw();

            // Should reject a boolean.
            expect(() =>
                typeAsserter.assertMatches(true, paramType, typeChecker),
            ).to.throw(
                TypeMismatchError,
                'Value does not match any type in union string | number',
            );
        });
    });
});
