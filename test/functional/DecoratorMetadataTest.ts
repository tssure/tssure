/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

/**
 * Helper to parse JSDoc tags from a source file.
 */
function parseJSDocTags(
    filePath: string,
    className: string,
    memberName: string,
): ts.JSDocTag[] {
    const sourceCode = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
        filePath,
        sourceCode,
        ts.ScriptTarget.Latest,
        true,
    );

    let tags: ts.JSDocTag[] = [];

    function visit(node: ts.Node) {
        if (ts.isClassDeclaration(node) && node.name?.text === className) {
            node.members.forEach((member) => {
                const name = member.name
                    ? (member.name as ts.Identifier).text
                    : 'constructor';
                if (name === memberName) {
                    const jsDocs = (member as any).jsDoc as
                        | ts.JSDoc[]
                        | undefined;
                    if (jsDocs) {
                        jsDocs.forEach((doc) => {
                            if (doc.tags) {
                                tags = tags.concat(doc.tags);
                            }
                        });
                    }
                }
            });
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return tags;
}

describe('JSDoc Metadata Integration', function () {
    describe('Fixture tags on constructor', function () {
        it('should have fixture JSDoc tags on constructor', function () {
            const filePath = path.join(
                __dirname,
                'fixtures',
                'CalculatorWithFixtures.ts',
            );
            const tags = parseJSDocTags(
                filePath,
                'CalculatorWithFixtures',
                'constructor',
            );

            const fixtureTags = tags.filter(
                (tag) => tag.tagName.text === 'fixture',
            );
            expect(fixtureTags).to.have.lengthOf(2);

            // Check first fixture tag
            const firstFixture = fixtureTags[0].comment as string;
            expect(firstFixture).to.include('default');
            expect(firstFixture).to.include('[10]');

            // Check second fixture tag
            const secondFixture = fixtureTags[1].comment as string;
            expect(secondFixture).to.include('base5');
            expect(secondFixture).to.include('[5]');
        });
    });

    describe('Fixture tags on static method', function () {
        it('should have fixture JSDoc tags on static factory method', function () {
            const filePath = path.join(
                __dirname,
                'fixtures',
                'MoneyWithStaticFixtures.ts',
            );
            const tags = parseJSDocTags(
                filePath,
                'MoneyWithStaticFixtures',
                'fromInt',
            );

            const fixtureTags = tags.filter(
                (tag) => tag.tagName.text === 'fixture',
            );
            expect(fixtureTags).to.have.lengthOf(3);

            const firstFixture = fixtureTags[0].comment as string;
            expect(firstFixture).to.include('default');
            expect(firstFixture).to.include('[1000]');

            const thirdFixture = fixtureTags[2].comment as string;
            expect(thirdFixture).to.include('gbp5');
            expect(thirdFixture).to.include('[500]');
        });
    });

    describe('Scenario tags on instance method', function () {
        it('should have scenario JSDoc tag with description', function () {
            const filePath = path.join(
                __dirname,
                'fixtures',
                'CalculatorWithFixtures.ts',
            );
            const tags = parseJSDocTags(
                filePath,
                'CalculatorWithFixtures',
                'add',
            );

            const scenarioTags = tags.filter(
                (tag) => tag.tagName.text === 'scenario',
            );
            expect(scenarioTags).to.have.lengthOf(1);

            const scenario = scenarioTags[0].comment as string;
            expect(scenario).to.include('description="add5"');
            expect(scenario).to.include('args=[5]');
            expect(scenario).to.include('expect=15');
            expect(scenario).to.include('instance="default"');
        });

        it('should have scenario JSDoc tag without description', function () {
            const filePath = path.join(
                __dirname,
                'fixtures',
                'CalculatorWithFixtures.ts',
            );
            const tags = parseJSDocTags(
                filePath,
                'CalculatorWithFixtures',
                'getBase',
            );

            const scenarioTags = tags.filter(
                (tag) => tag.tagName.text === 'scenario',
            );
            expect(scenarioTags).to.have.lengthOf(1);

            const scenario = scenarioTags[0].comment as string;
            expect(scenario).to.include('args=[]');
            expect(scenario).to.include('expect=10');
            expect(scenario).not.to.include('description=');
        });

        it('should have scenario with custom instance fixture', function () {
            const filePath = path.join(
                __dirname,
                'fixtures',
                'CalculatorWithFixtures.ts',
            );
            const tags = parseJSDocTags(
                filePath,
                'CalculatorWithFixtures',
                'multiply',
            );

            const scenarioTags = tags.filter(
                (tag) => tag.tagName.text === 'scenario',
            );
            expect(scenarioTags).to.have.lengthOf(1);

            const scenario = scenarioTags[0].comment as string;
            expect(scenario).to.include('instance="base5"');
            expect(scenario).to.include('expect=15');
        });
    });

    describe('Skip tags', function () {
        it('should have skip JSDoc tag with reason', function () {
            const filePath = path.join(
                __dirname,
                'fixtures',
                'SkippedClass.ts',
            );
            const tags = parseJSDocTags(
                filePath,
                'SkippedClass',
                'skippedMethod',
            );

            const skipTags = tags.filter((tag) => tag.tagName.text === 'skip');
            expect(skipTags).to.have.lengthOf(1);

            const skipReason = skipTags[0].comment as string;
            expect(skipReason).to.equal('Not yet implemented');
        });

        it('should have skip JSDoc tag without reason', function () {
            const filePath = path.join(
                __dirname,
                'fixtures',
                'SkippedClass.ts',
            );
            const tags = parseJSDocTags(
                filePath,
                'SkippedClass',
                'anotherSkippedMethod',
            );

            const skipTags = tags.filter((tag) => tag.tagName.text === 'skip');
            expect(skipTags).to.have.lengthOf(1);
        });

        it('should not have skip tag on normal methods', function () {
            const filePath = path.join(
                __dirname,
                'fixtures',
                'SkippedClass.ts',
            );
            const tags = parseJSDocTags(
                filePath,
                'SkippedClass',
                'normalMethod',
            );

            const skipTags = tags.filter((tag) => tag.tagName.text === 'skip');
            expect(skipTags).to.have.lengthOf(0);
        });
    });

    describe('Multiple scenarios on functions', function () {
        it('should have multiple scenario tags on a single function', function () {
            const filePath = path.join(
                __dirname,
                'fixtures',
                'functions-with-scenarios.ts',
            );
            const sourceCode = fs.readFileSync(filePath, 'utf-8');
            const sourceFile = ts.createSourceFile(
                filePath,
                sourceCode,
                ts.ScriptTarget.Latest,
                true,
            );

            let scenarioCount = 0;
            function visit(node: ts.Node) {
                if (
                    ts.isFunctionDeclaration(node) &&
                    node.name?.text === 'addNumbers'
                ) {
                    const jsDocs = (node as any).jsDoc as
                        | ts.JSDoc[]
                        | undefined;
                    if (jsDocs) {
                        jsDocs.forEach((doc) => {
                            if (doc.tags) {
                                scenarioCount = doc.tags.filter(
                                    (tag) => tag.tagName.text === 'scenario',
                                ).length;
                            }
                        });
                    }
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);
            expect(scenarioCount).to.equal(2);
        });
    });
});
