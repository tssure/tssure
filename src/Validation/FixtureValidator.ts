/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { FixtureInterface } from '../Attribute/FixtureInterface';
import { FixtureValidatorInterface } from './FixtureValidatorInterface';

/**
 * Service for validating fixture definitions.
 */
export class FixtureValidator implements FixtureValidatorInterface {
    /**
     * @inheritDoc
     */
    validateFixtures(
        fixtures: FixtureInterface[],
        className: string,
    ): string | null {
        const fixtureNames = new Map<string, number>();

        for (const fixture of fixtures) {
            const name = fixture.getName();
            const count = fixtureNames.get(name) || 0;

            fixtureNames.set(name, count + 1);
        }

        // Check for duplicate fixture names.
        for (const [name, count] of fixtureNames.entries()) {
            if (count > 1) {
                return `Duplicate fixture name "${name}" found ${count} times on class "${className}"`;
            }
        }

        return null;
    }
}
