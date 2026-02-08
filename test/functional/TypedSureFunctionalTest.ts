/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import type { Fixture } from '../../src/Attribute/Fixture';
import type { Scenario } from '../../src/Attribute/Scenario';
import { TypedSureParser } from '../../src/Type/TypedSureParser';
import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

/**
 * Helper to parse TypedSure annotations from a source file.
 */
function parseTypedSureFromFile(
    filePath: string,
    className: string,
    memberName: string,
): {
    scenarios: Scenario[];
    fixtures: Fixture[];
} {
    const sourceCode = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
        filePath,
        sourceCode,
        ts.ScriptTarget.Latest,
        true,
    );

    const program = ts.createProgram([filePath], {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
        strict: true,
        esModuleInterop: true,
    });

    const typeChecker = program.getTypeChecker();
    const parser = new TypedSureParser();

    let scenarios: Scenario[] = [];
    let fixtures: Fixture[] = [];

    function visit(node: ts.Node) {
        if (ts.isClassDeclaration(node) && node.name?.text === className) {
            node.members.forEach((member) => {
                const name = member.name
                    ? (member.name as ts.Identifier).text
                    : 'constructor';

                if (name === memberName) {
                    if (ts.isConstructorDeclaration(member)) {
                        fixtures = parser.parseFixtures(member, typeChecker);
                    } else if (ts.isMethodDeclaration(member)) {
                        scenarios = parser.parseScenarios(member, typeChecker);
                        fixtures = parser.parseFixtures(member, typeChecker);
                    }
                }
            });
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return { scenarios, fixtures };
}

describe('TypedSure Functional', function () {
    this.timeout(10000);

    describe('Fixture annotations on constructor', function () {
        it('should use JSDoc for constructor fixtures (TypedSure not supported)', function () {
            const filePath = path.join(
                __dirname,
                'fixtures',
                'CalculatorWithTypedSure.ts',
            );
            const { fixtures } = parseTypedSureFromFile(
                filePath,
                'CalculatorWithTypedSure',
                'constructor',
            );

            // Note: TypeScript does not allow return type annotations on constructors,
            // so TypedSure cannot be used for constructor fixtures.
            // JSDoc @fixture annotations should be used instead.
            expect(fixtures).to.have.lengthOf(0);
        });
    });

    describe('Scenario annotations on instance methods', function () {
        it('should parse TypedSure scenario annotation with description', function () {
            const filePath = path.join(
                __dirname,
                'fixtures',
                'CalculatorWithTypedSure.ts',
            );
            const { scenarios } = parseTypedSureFromFile(
                filePath,
                'CalculatorWithTypedSure',
                'add',
            );

            expect(scenarios).to.have.lengthOf(1);

            expect(scenarios[0].getDescription()).to.equal('add5');
            expect(scenarios[0].getArguments()).to.deep.equal([5]);
            expect(scenarios[0].getExpectation()).to.equal(15);
            expect(scenarios[0].getInstanceFixtureName()).to.equal('default');
        });

        it('should parse TypedSure scenario annotation without description', function () {
            const filePath = path.join(
                __dirname,
                'fixtures',
                'CalculatorWithTypedSure.ts',
            );
            const { scenarios } = parseTypedSureFromFile(
                filePath,
                'CalculatorWithTypedSure',
                'getBase',
            );

            expect(scenarios).to.have.lengthOf(1);

            expect(scenarios[0].getDescription()).to.be.null;
            expect(scenarios[0].getArguments()).to.deep.equal([]);
            expect(scenarios[0].getExpectation()).to.equal(10);
        });

        it('should parse TypedSure scenario with custom instance fixture', function () {
            const filePath = path.join(
                __dirname,
                'fixtures',
                'CalculatorWithTypedSure.ts',
            );
            const { scenarios } = parseTypedSureFromFile(
                filePath,
                'CalculatorWithTypedSure',
                'multiply',
            );

            expect(scenarios).to.have.lengthOf(1);

            expect(scenarios[0].getDescription()).to.equal('multiply3');
            expect(scenarios[0].getArguments()).to.deep.equal([3]);
            expect(scenarios[0].getExpectation()).to.equal(15);
            expect(scenarios[0].getInstanceFixtureName()).to.equal('base5');
        });
    });

    describe('TypedSure for method scenarios', function () {
        it('should parse method scenarios using TypedSure', function () {
            const typedSureFilePath = path.join(
                __dirname,
                'fixtures',
                'CalculatorWithTypedSure.ts',
            );

            // Parse add method scenarios from TypedSure file.
            const typedSureAdd = parseTypedSureFromFile(
                typedSureFilePath,
                'CalculatorWithTypedSure',
                'add',
            );

            expect(typedSureAdd.scenarios).to.have.lengthOf(1);
            expect(typedSureAdd.scenarios[0].getDescription()).to.equal('add5');
            expect(typedSureAdd.scenarios[0].getArguments()).to.deep.equal([5]);
            expect(typedSureAdd.scenarios[0].getExpectation()).to.equal(15);
        });
    });
});
