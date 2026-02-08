/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { TypeAsserterInterface } from '../Assert/TypeAsserterInterface';
import { Expectation } from '../Attribute/Expectation';
import { ClassInfo } from '../Discovery/ClassInfo';
import { MethodInfo } from '../Discovery/MethodInfo';
import { FailResult } from '../Runner/Result/FailResult';
import { PassResult } from '../Runner/Result/PassResult';
import { SkipResult } from '../Runner/Result/SkipResult';
import { TestExecutorInterface } from './TestExecutorInterface';
import * as ts from 'typescript';

/**
 * Service for executing test scenarios.
 */
export class TestExecutor implements TestExecutorInterface {
    constructor(private readonly typeAsserter: TypeAsserterInterface) {}

    /**
     * @inheritDoc
     */
    executeClassTests(
        classInfo: ClassInfo,
        typeChecker: ts.TypeChecker,
    ): {
        passes: PassResult[];
        failures: FailResult[];
        skips: SkipResult[];
    } {
        const passes: PassResult[] = [];
        const failures: FailResult[] = [];
        const skips: SkipResult[] = [];

        const className = classInfo.getName();
        const fixtures = classInfo.getFixtures();
        const methods = classInfo.getMethods();
        const classNode = classInfo.getNode();

        // Get the source file path.
        const sourceFile = classNode.getSourceFile();
        const filePath = sourceFile.fileName;

        // Clear require cache for fresh loads.
        // TODO: Better handling for ES Modules etc.
        if (filePath.endsWith('.ts')) {
            try {
                delete require.cache[require.resolve(filePath)];
            } catch {
                // File not in cache yet.
            }
        }

        // Load the module to get the actual class constructor.
        let classConstructor: any;

        try {
            // Require the module and get the class by name.
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const module = require(filePath);
            classConstructor = module[className];

            if (!classConstructor) {
                failures.push(
                    new FailResult(
                        className,
                        `Class "${className}" not found in module exports`,
                    ),
                );

                return { passes, failures, skips };
            }
        } catch (error) {
            failures.push(
                new FailResult(
                    className,
                    `Failed to load module: ${error instanceof Error ? error.message : String(error)}`,
                ),
            );

            return { passes, failures, skips };
        }

        // Create a map of fixture instances.
        const fixtureInstances = new Map<string, any>();

        // Instantiate fixtures.
        for (const fixture of fixtures) {
            try {
                const fixtureName = fixture.getName();
                const args = fixture.getArguments();

                // Create instance with fixture arguments.
                const instance = new classConstructor(...args);

                fixtureInstances.set(fixtureName, instance);
            } catch (error) {
                failures.push(
                    new FailResult(
                        `${className}.${fixture.getName()}`,
                        `Failed to create fixture: ${error instanceof Error ? error.message : String(error)}`,
                    ),
                );
            }
        }

        // Execute scenarios for each method.
        for (const method of methods) {
            this.executeMethodScenarios(
                className,
                method,
                fixtureInstances,
                classConstructor,
                typeChecker,
                passes,
                failures,
                skips,
            );
        }

        return { passes, failures, skips };
    }

    /**
     * Executes all scenarios for a method.
     */
    executeMethodScenarios(
        className: string,
        method: MethodInfo,
        fixtureInstances: Map<string, any>,
        classConstructor: any,
        typeChecker: ts.TypeChecker,
        passes: PassResult[],
        failures: FailResult[],
        skips: SkipResult[],
    ): void {
        const methodName = method.getName();
        const scenarios = method.getScenarios();
        const methodNode = method.getNode();

        // Check if the method should be skipped.
        if (method.isSkipped()) {
            const skipReason = method.getSkipReason() || 'Skipped';

            for (const scenario of scenarios) {
                const scenarioDesc =
                    scenario.getDescription() || `scenario for ${methodName}`;
                const testIdentifier = `${className}.${methodName} - ${scenarioDesc}`;

                skips.push(new SkipResult(testIdentifier, skipReason));
            }

            return;
        }

        for (const scenario of scenarios) {
            const scenarioDesc =
                scenario.getDescription() || `scenario for ${methodName}`;
            const testIdentifier = `${className}.${methodName} - ${scenarioDesc}`;

            try {
                const args = scenario.getArguments();
                const expectation = scenario.getExpectation();
                const instanceFixtureName = scenario.getInstanceFixtureName();

                // Get the instance for this scenario.
                let instance: any = null;
                let methodFunction: ((...args: any[]) => any) | undefined;

                if (method.isStaticMethod()) {
                    // For static methods, use the class constructor.
                    methodFunction = classConstructor[methodName];
                } else {
                    // For instance methods, get the instance from fixtures.
                    instance = fixtureInstances.get(instanceFixtureName);

                    if (!instance) {
                        failures.push(
                            new FailResult(
                                testIdentifier,
                                `Fixture "${instanceFixtureName}" not found for instance method`,
                            ),
                        );
                        continue;
                    }

                    methodFunction = instance[methodName];
                }

                if (!methodFunction || typeof methodFunction !== 'function') {
                    failures.push(
                        new FailResult(
                            testIdentifier,
                            `Method "${methodName}" not found or not a function`,
                        ),
                    );
                    continue;
                }

                // Execute the method.
                const result = methodFunction.apply(instance, args);

                // Validate the result.
                if (expectation === Expectation.TYPE_CHECK) {
                    // Type check only.
                    const returnType = typeChecker.getTypeAtLocation(
                        methodNode.type || methodNode,
                    );

                    this.typeAsserter.assertMatches(
                        result,
                        returnType,
                        typeChecker,
                        classConstructor,
                    );

                    passes.push(
                        new PassResult(`${testIdentifier} - type check passed`),
                    );
                } else {
                    // Value comparison.
                    if (result !== expectation) {
                        failures.push(
                            new FailResult(
                                testIdentifier,
                                `Expected ${JSON.stringify(expectation)}, got ${JSON.stringify(result)}`,
                            ),
                        );
                    } else {
                        passes.push(
                            new PassResult(
                                `${testIdentifier} - value check passed`,
                            ),
                        );
                    }
                }
            } catch (error) {
                failures.push(
                    new FailResult(
                        testIdentifier,
                        `Test execution failed: ${error instanceof Error ? error.message : String(error)}`,
                    ),
                );
            }
        }
    }
}
