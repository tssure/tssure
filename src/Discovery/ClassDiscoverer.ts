/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { TypedSureParserInterface } from '../Type/TypedSureParserInterface';
import { ClassDiscovererInterface } from './ClassDiscovererInterface';
import { ClassInfo } from './ClassInfo';
import { MethodInfo } from './MethodInfo';
import * as ts from 'typescript';

/**
 * Service for discovering classes and their fixtures from TypeScript source files.
 */
export class ClassDiscoverer implements ClassDiscovererInterface {
    constructor(private readonly parser: TypedSureParserInterface) {}

    /**
     * @inheritDoc
     */
    discoverClasses(
        sourceFiles: ts.SourceFile[],
        typeChecker: ts.TypeChecker,
    ): ClassInfo[] {
        const classes: ClassInfo[] = [];

        for (const sourceFile of sourceFiles) {
            this.visitNode(sourceFile, typeChecker, classes);
        }

        return classes;
    }

    /**
     * Discovers all fixtures for a class.
     */
    discoverFixturesForClass(
        classNode: ts.ClassDeclaration,
        typeChecker: ts.TypeChecker,
    ) {
        const allFixtures = [];

        for (const member of classNode.members) {
            if (ts.isConstructorDeclaration(member)) {
                const fixtures = this.parser.parseFixtures(member, typeChecker);
                allFixtures.push(...fixtures);
            } else if (ts.isMethodDeclaration(member)) {
                const fixtures = this.parser.parseFixtures(member, typeChecker);
                allFixtures.push(...fixtures);
            }
        }

        return allFixtures;
    }

    /**
     * Discovers all methods with scenarios for a class.
     */
    discoverMethodsForClass(
        classNode: ts.ClassDeclaration,
        typeChecker: ts.TypeChecker,
    ): MethodInfo[] {
        const methods: MethodInfo[] = [];

        for (const member of classNode.members) {
            if (ts.isMethodDeclaration(member) && member.name) {
                const methodName = (member.name as ts.Identifier).text;
                const scenarios = this.parser.parseScenarios(
                    member,
                    typeChecker,
                );

                // Only include methods that have scenarios.
                if (scenarios.length > 0) {
                    const isStatic =
                        member.modifiers?.some(
                            (mod) => mod.kind === ts.SyntaxKind.StaticKeyword,
                        ) ?? false;

                    const skipReason = this.parser.parseSkip(
                        member,
                        typeChecker,
                    );

                    methods.push(
                        new MethodInfo(
                            methodName,
                            scenarios,
                            member,
                            isStatic,
                            skipReason,
                        ),
                    );
                }
            }
        }

        return methods;
    }

    /**
     * Visits a node and its children to discover classes.
     */
    visitNode(
        node: ts.Node,
        typeChecker: ts.TypeChecker,
        classes: ClassInfo[],
    ): void {
        if (ts.isClassDeclaration(node) && node.name) {
            const className = node.name.text;
            const fixtures = this.discoverFixturesForClass(node, typeChecker);
            const methods = this.discoverMethodsForClass(node, typeChecker);

            classes.push(new ClassInfo(className, fixtures, methods, node));
        }

        ts.forEachChild(node, (child) =>
            this.visitNode(child, typeChecker, classes),
        );
    }
}
