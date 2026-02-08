/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { Expectation } from './Expectation';
import { ScenarioInterface } from './ScenarioInterface';

/**
 * Metadata for defining verification scenarios on methods and functions.
 */
export class Scenario implements ScenarioInterface {
    public static readonly DEFAULT_INSTANCE = 'default';

    public readonly DEFAULT_INSTANCE = Scenario.DEFAULT_INSTANCE;

    /**
     * @param description Optional description of the scenario.
     * @param args Positional array of arguments, in parameter order.
     * @param expect Optional expected value. Supports Expectation.TYPE_CHECK or a scalar value to compare against.
     * @param instance Name of the fixture to use for creating the instance.
     *                 Only applicable to instance method scenarios. Defaults to 'default' if not specified.
     */
    constructor(
        private readonly description: string | null = null,
        private readonly args: unknown[] = [],
        private readonly expect: unknown = Expectation.TYPE_CHECK,
        private readonly instance: string = Scenario.DEFAULT_INSTANCE,
    ) {}

    /**
     * @inheritDoc
     */
    getArguments(): unknown[] {
        return this.args;
    }

    /**
     * @inheritDoc
     */
    getDescription(): string | null {
        return this.description;
    }

    /**
     * @inheritDoc
     */
    getExpectation(): unknown {
        return this.expect;
    }

    /**
     * @inheritDoc
     */
    getInstanceFixtureName(): string {
        return this.instance;
    }
}
