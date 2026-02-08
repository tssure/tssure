/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { ScenarioInterface } from './ScenarioInterface';

/**
 * Interface for fixture metadata.
 * Fixtures are also scenarios - they define both how to create instances and verification cases.
 */
export interface FixtureInterface extends ScenarioInterface {
    /**
     * Fetches the name of this fixture.
     */
    getName(): string;
}
