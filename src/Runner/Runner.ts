/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { ClassDiscovererInterface } from '../Discovery/ClassDiscovererInterface';
import { ScannerInterface } from '../Discovery/ScannerInterface';
import { TestExecutorInterface } from '../Execution/TestExecutorInterface';
import { FixtureValidatorInterface } from '../Validation/FixtureValidatorInterface';
import { FailResult } from './Result/FailResult';
import { PassResult } from './Result/PassResult';
import { SkipResult } from './Result/SkipResult';
import { TestResult } from './Result/TestResult';
import { WarningResult } from './Result/WarningResult';
import { RunnerInterface } from './RunnerInterface';

/**
 * Service for running contract verifications.
 */
export class Runner implements RunnerInterface {
    constructor(
        private readonly scanner: ScannerInterface,
        private readonly classDiscoverer: ClassDiscovererInterface,
        private readonly fixtureValidator: FixtureValidatorInterface,
        private readonly testExecutor: TestExecutorInterface,
    ) {}

    /**
     * @inheritDoc
     */
    run(path: string): TestResult {
        const { sourceFiles, typeChecker } = this.scanner.scan(path);

        const passes: PassResult[] = [];
        const failures: FailResult[] = [];
        const skips: SkipResult[] = [];
        const warnings: WarningResult[] = [];

        // Discover all classes and their fixtures.
        const classes = this.classDiscoverer.discoverClasses(
            sourceFiles,
            typeChecker,
        );

        // Validate fixtures for each class.
        for (const classInfo of classes) {
            const validationError = this.fixtureValidator.validateFixtures(
                classInfo.getFixtures(),
                classInfo.getName(),
            );

            if (validationError) {
                failures.push(
                    new FailResult(classInfo.getName(), validationError),
                );

                // Skip execution for this class, as fixture validation failed.
                continue;
            }

            // Execute verifications for this class.
            const results = this.testExecutor.executeClassTests(
                classInfo,
                typeChecker,
            );

            passes.push(...results.passes);
            failures.push(...results.failures);
            skips.push(...results.skips);
        }

        return new TestResult(passes, failures, skips, warnings);
    }
}
