/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { Expectation } from './Expectation';
import { FixtureInterface } from './FixtureInterface';
import { Scenario } from './Scenario';

/**
 * Metadata for defining fixtures on constructors.
 * Fixtures define both how to create instances and serve as test scenarios.
 */
export class Fixture extends Scenario implements FixtureInterface {
    public static readonly DEFAULT_NAME = 'default';

    /**
     * @param name Name of this fixture. Defaults to 'default'.
     * @param args Arguments to pass to the constructor.
     * @param description Optional description of the fixture scenario.
     * @param expect Optional expected value for the fixture scenario.
     */
    constructor(
        private readonly name: string = Fixture.DEFAULT_NAME,
        args: unknown[] = [],
        description: string | null = null,
        expect: unknown = Expectation.TYPE_CHECK,
    ) {
        super(description, args, expect, name);
    }

    /**
     * @inheritDoc
     */
    getName(): string {
        return this.name;
    }
}
