/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { Expectation } from '../../../src/Attribute/Expectation';
import { Fixture } from '../../../src/Attribute/Fixture';
import { Scenario } from '../../../src/Attribute/Scenario';
import { TypedSureParser } from '../../../src/Type/TypedSureParser';
import { expect } from 'chai';
import * as ts from 'typescript';

describe('TypedSureParser Integrated', () => {
    let parser: TypedSureParser;

    beforeEach(() => {
        parser = new TypedSureParser();
    });

    describe('parseScenarios()', () => {
        it('should parse scenarios from TypedSure type annotation', () => {
            const sourceCode = `
                import { TypedSure } from './TypedSure';

                class TestClass {
                    method(value: number): TypedSure<number, {
                        scenarios: [
                            { description: 'test1', args: [5], expect: 10, instance: 'default' }
                        ]
                    }> {
                        return value * 2;
                    }
                }
            `;

            const sourceFile = ts.createSourceFile(
                'test.ts',
                sourceCode,
                ts.ScriptTarget.Latest,
                true,
            );

            const program = ts.createProgram(['test.ts'], {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.CommonJS,
            });
            const typeChecker = program.getTypeChecker();

            let methodNode: ts.MethodDeclaration | undefined;

            function visit(node: ts.Node) {
                if (
                    ts.isMethodDeclaration(node) &&
                    node.name &&
                    (node.name as ts.Identifier).text === 'method'
                ) {
                    methodNode = node;
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            expect(methodNode).to.exist;

            const scenarios = parser.parseScenarios(methodNode!, typeChecker);

            expect(scenarios).to.have.lengthOf(1);
            expect(scenarios[0]).to.be.instanceOf(Scenario);
            expect(scenarios[0].getDescription()).to.equal('test1');
            expect(scenarios[0].getArguments()).to.deep.equal([5]);
            expect(scenarios[0].getExpectation()).to.equal(10);
            expect(scenarios[0].getInstanceFixtureName()).to.equal('default');
        });

        it('should parse multiple scenarios from TypedSure type annotation', () => {
            const sourceCode = `
                import { TypedSure } from './TypedSure';

                class TestClass {
                    method(value: number): TypedSure<number, {
                        scenarios: [
                            { description: 'test1', args: [5], expect: 10 },
                            { description: 'test2', args: [3], expect: 6 }
                        ]
                    }> {
                        return value * 2;
                    }
                }
            `;

            const sourceFile = ts.createSourceFile(
                'test.ts',
                sourceCode,
                ts.ScriptTarget.Latest,
                true,
            );

            const program = ts.createProgram(['test.ts'], {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.CommonJS,
            });
            const typeChecker = program.getTypeChecker();

            let methodNode: ts.MethodDeclaration | undefined;

            function visit(node: ts.Node) {
                if (
                    ts.isMethodDeclaration(node) &&
                    node.name &&
                    (node.name as ts.Identifier).text === 'method'
                ) {
                    methodNode = node;
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            const scenarios = parser.parseScenarios(methodNode!, typeChecker);

            expect(scenarios).to.have.lengthOf(2);
            expect(scenarios[0].getDescription()).to.equal('test1');
            expect(scenarios[0].getArguments()).to.deep.equal([5]);
            expect(scenarios[1].getDescription()).to.equal('test2');
            expect(scenarios[1].getArguments()).to.deep.equal([3]);
        });

        it('should return empty array when no TypedSure annotation present', () => {
            const sourceCode = `
                class TestClass {
                    method(value: number): number {
                        return value * 2;
                    }
                }
            `;

            const sourceFile = ts.createSourceFile(
                'test.ts',
                sourceCode,
                ts.ScriptTarget.Latest,
                true,
            );

            const program = ts.createProgram(['test.ts'], {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.CommonJS,
            });
            const typeChecker = program.getTypeChecker();

            let methodNode: ts.MethodDeclaration | undefined;

            function visit(node: ts.Node) {
                if (
                    ts.isMethodDeclaration(node) &&
                    node.name &&
                    (node.name as ts.Identifier).text === 'method'
                ) {
                    methodNode = node;
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            const scenarios = parser.parseScenarios(methodNode!, typeChecker);

            expect(scenarios).to.be.an('array').that.is.empty;
        });

        it('should use default values for optional scenario properties', () => {
            const sourceCode = `
                import { TypedSure } from './TypedSure';

                class TestClass {
                    method(value: number): TypedSure<number, {
                        scenarios: [
                            { args: [5] }
                        ]
                    }> {
                        return value * 2;
                    }
                }
            `;

            const sourceFile = ts.createSourceFile(
                'test.ts',
                sourceCode,
                ts.ScriptTarget.Latest,
                true,
            );

            const program = ts.createProgram(['test.ts'], {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.CommonJS,
            });
            const typeChecker = program.getTypeChecker();

            let methodNode: ts.MethodDeclaration | undefined;

            function visit(node: ts.Node) {
                if (
                    ts.isMethodDeclaration(node) &&
                    node.name &&
                    (node.name as ts.Identifier).text === 'method'
                ) {
                    methodNode = node;
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            const scenarios = parser.parseScenarios(methodNode!, typeChecker);

            expect(scenarios).to.have.lengthOf(1);
            expect(scenarios[0].getDescription()).to.be.null;
            expect(scenarios[0].getExpectation()).to.equal(
                Expectation.TYPE_CHECK,
            );
            expect(scenarios[0].getInstanceFixtureName()).to.equal('default');
        });
    });

    describe('parseFixtures()', () => {
        it('should parse fixtures from TypedSure type annotation on constructor', () => {
            const sourceCode = `
                import { TypedSure } from './TypedSure';

                class TestClass {
                    constructor(value: number): TypedSure<void, {
                        fixtures: [
                            { name: 'default', args: [10] },
                            { name: 'custom', args: [20] }
                        ]
                    }> {}
                }
            `;

            const sourceFile = ts.createSourceFile(
                'test.ts',
                sourceCode,
                ts.ScriptTarget.Latest,
                true,
            );

            const program = ts.createProgram(['test.ts'], {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.CommonJS,
            });
            const typeChecker = program.getTypeChecker();

            let constructorNode: ts.ConstructorDeclaration | undefined;

            function visit(node: ts.Node) {
                if (ts.isConstructorDeclaration(node)) {
                    constructorNode = node;
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            expect(constructorNode).to.exist;

            const fixtures = parser.parseFixtures(
                constructorNode!,
                typeChecker,
            );

            expect(fixtures).to.have.lengthOf(2);
            expect(fixtures[0]).to.be.instanceOf(Fixture);
            expect(fixtures[0].getName()).to.equal('default');
            expect(fixtures[0].getArguments()).to.deep.equal([10]);
            expect(fixtures[1].getName()).to.equal('custom');
            expect(fixtures[1].getArguments()).to.deep.equal([20]);
        });

        it('should use default name "default" when fixture name is not provided', () => {
            const sourceCode = `
                import { TypedSure } from './TypedSure';

                class TestClass {
                    constructor(value: number): TypedSure<void, {
                        fixtures: [
                            { args: [10] },
                            { name: 'custom', args: [20] }
                        ]
                    }> {}
                }
            `;

            const sourceFile = ts.createSourceFile(
                'test.ts',
                sourceCode,
                ts.ScriptTarget.Latest,
                true,
            );

            const program = ts.createProgram(['test.ts'], {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.CommonJS,
            });
            const typeChecker = program.getTypeChecker();

            let constructorNode: ts.ConstructorDeclaration | undefined;

            function visit(node: ts.Node) {
                if (ts.isConstructorDeclaration(node)) {
                    constructorNode = node;
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            expect(constructorNode).to.exist;

            const fixtures = parser.parseFixtures(
                constructorNode!,
                typeChecker,
            );

            expect(fixtures).to.have.lengthOf(2);
            expect(fixtures[0]).to.be.instanceOf(Fixture);
            expect(fixtures[0].getName()).to.equal('default');
            expect(fixtures[0].getArguments()).to.deep.equal([10]);
            expect(fixtures[1].getName()).to.equal('custom');
            expect(fixtures[1].getArguments()).to.deep.equal([20]);
        });

        it('should return empty array when no TypedSure annotation present', () => {
            const sourceCode = `
                class TestClass {
                    constructor(value: number) {}
                }
            `;

            const sourceFile = ts.createSourceFile(
                'test.ts',
                sourceCode,
                ts.ScriptTarget.Latest,
                true,
            );

            const program = ts.createProgram(['test.ts'], {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.CommonJS,
            });
            const typeChecker = program.getTypeChecker();

            let constructorNode: ts.ConstructorDeclaration | undefined;

            function visit(node: ts.Node) {
                if (ts.isConstructorDeclaration(node)) {
                    constructorNode = node;
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            const fixtures = parser.parseFixtures(
                constructorNode!,
                typeChecker,
            );

            expect(fixtures).to.be.an('array').that.is.empty;
        });
    });

    describe('parseSkip()', () => {
        it('should parse skip with string reason from TypedSure type annotation', () => {
            const sourceCode = `
                import { TypedSure } from './TypedSure';

                class TestClass {
                    method(value: number): TypedSure<number, {
                        skip: 'Not yet implemented'
                    }> {
                        return value * 2;
                    }
                }
            `;

            const sourceFile = ts.createSourceFile(
                'test.ts',
                sourceCode,
                ts.ScriptTarget.Latest,
                true,
            );

            const program = ts.createProgram(['test.ts'], {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.CommonJS,
            });
            const typeChecker = program.getTypeChecker();

            let methodNode: ts.MethodDeclaration | undefined;

            function visit(node: ts.Node) {
                if (
                    ts.isMethodDeclaration(node) &&
                    node.name &&
                    (node.name as ts.Identifier).text === 'method'
                ) {
                    methodNode = node;
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            const skipReason = parser.parseSkip(methodNode!, typeChecker);

            expect(skipReason).to.equal('Not yet implemented');
        });

        it('should parse skip with boolean true from TypedSure type annotation', () => {
            const sourceCode = `
                import { TypedSure } from './TypedSure';

                class TestClass {
                    method(value: number): TypedSure<number, {
                        skip: true
                    }> {
                        return value * 2;
                    }
                }
            `;

            const sourceFile = ts.createSourceFile(
                'test.ts',
                sourceCode,
                ts.ScriptTarget.Latest,
                true,
            );

            const program = ts.createProgram(['test.ts'], {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.CommonJS,
            });
            const typeChecker = program.getTypeChecker();

            let methodNode: ts.MethodDeclaration | undefined;

            function visit(node: ts.Node) {
                if (
                    ts.isMethodDeclaration(node) &&
                    node.name &&
                    (node.name as ts.Identifier).text === 'method'
                ) {
                    methodNode = node;
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            const skipReason = parser.parseSkip(methodNode!, typeChecker);

            expect(skipReason).to.equal('Skipped');
        });

        it('should return null when no skip annotation present', () => {
            const sourceCode = `
                import { TypedSure } from './TypedSure';

                class TestClass {
                    method(value: number): TypedSure<number, {
                        scenarios: [
                            { args: [5], expect: 10 }
                        ]
                    }> {
                        return value * 2;
                    }
                }
            `;

            const sourceFile = ts.createSourceFile(
                'test.ts',
                sourceCode,
                ts.ScriptTarget.Latest,
                true,
            );

            const program = ts.createProgram(['test.ts'], {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.CommonJS,
            });
            const typeChecker = program.getTypeChecker();

            let methodNode: ts.MethodDeclaration | undefined;

            function visit(node: ts.Node) {
                if (
                    ts.isMethodDeclaration(node) &&
                    node.name &&
                    (node.name as ts.Identifier).text === 'method'
                ) {
                    methodNode = node;
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            const skipReason = parser.parseSkip(methodNode!, typeChecker);

            expect(skipReason).to.be.null;
        });

        it('should return null when no TypedSure annotation present', () => {
            const sourceCode = `
                class TestClass {
                    method(value: number): number {
                        return value * 2;
                    }
                }
            `;

            const sourceFile = ts.createSourceFile(
                'test.ts',
                sourceCode,
                ts.ScriptTarget.Latest,
                true,
            );

            const program = ts.createProgram(['test.ts'], {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.CommonJS,
            });
            const typeChecker = program.getTypeChecker();

            let methodNode: ts.MethodDeclaration | undefined;

            function visit(node: ts.Node) {
                if (
                    ts.isMethodDeclaration(node) &&
                    node.name &&
                    (node.name as ts.Identifier).text === 'method'
                ) {
                    methodNode = node;
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            const skipReason = parser.parseSkip(methodNode!, typeChecker);

            expect(skipReason).to.be.null;
        });

        it('should parse skip on function declaration', () => {
            const sourceCode = `
                import { TypedSure } from './TypedSure';

                function testFunction(value: number): TypedSure<number, {
                    skip: 'Work in progress'
                }> {
                    return value * 2;
                }
            `;

            const sourceFile = ts.createSourceFile(
                'test.ts',
                sourceCode,
                ts.ScriptTarget.Latest,
                true,
            );

            const program = ts.createProgram(['test.ts'], {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.CommonJS,
            });
            const typeChecker = program.getTypeChecker();

            let functionNode: ts.FunctionDeclaration | undefined;

            function visit(node: ts.Node) {
                if (
                    ts.isFunctionDeclaration(node) &&
                    node.name &&
                    node.name.text === 'testFunction'
                ) {
                    functionNode = node;
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            const skipReason = parser.parseSkip(functionNode!, typeChecker);

            expect(skipReason).to.equal('Work in progress');
        });
    });
});
