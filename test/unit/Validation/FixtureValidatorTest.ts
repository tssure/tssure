/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { Fixture } from '../../../src/Attribute/Fixture';
import { FixtureValidator } from '../../../src/Validation/FixtureValidator';
import { expect } from 'chai';

describe('FixtureValidator', () => {
    let validator: FixtureValidator;

    beforeEach(() => {
        validator = new FixtureValidator();
    });

    describe('validateFixtures()', () => {
        it('should return null when there are no fixtures', () => {
            const result = validator.validateFixtures([], 'TestClass');

            expect(result).to.be.null;
        });

        it('should return null when there is only one fixture', () => {
            const fixtures = [new Fixture('default', [1, 2, 3])];

            const result = validator.validateFixtures(fixtures, 'TestClass');

            expect(result).to.be.null;
        });

        it('should return null when all fixtures have unique names', () => {
            const fixtures = [
                new Fixture('default', [1]),
                new Fixture('custom', [2]),
                new Fixture('another', [3]),
            ];

            const result = validator.validateFixtures(fixtures, 'TestClass');

            expect(result).to.be.null;
        });

        it('should return error message when two fixtures have the same explicit name', () => {
            const fixtures = [
                new Fixture('duplicate', [1]),
                new Fixture('duplicate', [2]),
            ];

            const result = validator.validateFixtures(fixtures, 'TestClass');

            expect(result).to.equal(
                'Duplicate fixture name "duplicate" found 2 times on class "TestClass"',
            );
        });

        it('should return error message when two fixtures both use default name', () => {
            const fixtures = [new Fixture(), new Fixture()];

            const result = validator.validateFixtures(fixtures, 'TestClass');

            expect(result).to.equal(
                'Duplicate fixture name "default" found 2 times on class "TestClass"',
            );
        });

        it('should return error message when three fixtures have the same name', () => {
            const fixtures = [
                new Fixture('triple', [1]),
                new Fixture('triple', [2]),
                new Fixture('triple', [3]),
            ];

            const result = validator.validateFixtures(fixtures, 'TestClass');

            expect(result).to.equal(
                'Duplicate fixture name "triple" found 3 times on class "TestClass"',
            );
        });

        it('should return error message for first duplicate found when multiple duplicates exist', () => {
            const fixtures = [
                new Fixture('dup1', [1]),
                new Fixture('dup1', [2]),
                new Fixture('dup2', [3]),
                new Fixture('dup2', [4]),
            ];

            const result = validator.validateFixtures(fixtures, 'TestClass');

            // Should report one of the duplicates (order may vary based on Map iteration).
            expect(result).to.match(
                /Duplicate fixture name "(dup1|dup2)" found 2 times on class "TestClass"/,
            );
        });

        it('should include class name in error message', () => {
            const fixtures = [
                new Fixture('same', [1]),
                new Fixture('same', [2]),
            ];

            const result = validator.validateFixtures(
                fixtures,
                'MyCustomClass',
            );

            expect(result).to.include('MyCustomClass');
        });
    });
});
