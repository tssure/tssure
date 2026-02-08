/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { ClassInfo } from '../Discovery/ClassInfo';
import { FailResult } from '../Runner/Result/FailResult';
import { PassResult } from '../Runner/Result/PassResult';
import { SkipResult } from '../Runner/Result/SkipResult';
import * as ts from 'typescript';

/**
 * Interface for test executor service.
 */
export interface TestExecutorInterface {
    /**
     * Executes all verification scenarios for a class.
     *
     * @param classInfo The class information.
     * @param typeChecker The TypeScript type checker.
     * @returns Arrays of pass, fail, and skip results.
     */
    executeClassTests(
        classInfo: ClassInfo,
        typeChecker: ts.TypeChecker,
    ): {
        passes: PassResult[];
        failures: FailResult[];
        skips: SkipResult[];
    };
}
