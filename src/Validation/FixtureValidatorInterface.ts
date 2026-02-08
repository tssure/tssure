/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { FixtureInterface } from '../Attribute/FixtureInterface';

/**
 * Interface for fixture validator service.
 */
export interface FixtureValidatorInterface {
    /**
     * Validates that there are no duplicate fixture names.
     *
     * @param fixtures The fixtures to validate.
     * @param className The name of the class the fixtures belong to.
     * @returns An error message if validation fails, null otherwise.
     */
    validateFixtures(
        fixtures: FixtureInterface[],
        className: string,
    ): string | null;
}
