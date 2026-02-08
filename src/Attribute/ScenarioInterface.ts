/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

/**
 * Interface for scenario metadata.
 */
export interface ScenarioInterface {
    /**
     * Default instance fixture name.
     */
    readonly DEFAULT_INSTANCE: string;

    /**
     * Fetches the arguments for this scenario.
     */
    getArguments(): unknown[];

    /**
     * Fetches the description of this scenario.
     */
    getDescription(): string | null;

    /**
     * Fetches the expected value or validation mode.
     */
    getExpectation(): unknown;

    /**
     * Fetches the name of the fixture instance to use.
     */
    getInstanceFixtureName(): string;
}
