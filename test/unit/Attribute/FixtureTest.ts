/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { Expectation } from '../../../src/Attribute/Expectation';
import { Fixture } from '../../../src/Attribute/Fixture';
import { expect } from 'chai';

describe('Fixture', () => {
    describe('constructor()', () => {
        it('should create a fixture with all parameters', () => {
            const fixture = new Fixture(
                'myFixture',
                [1, 2],
                'test description',
                3,
            );

            expect(fixture.getName()).to.equal('myFixture');
            expect(fixture.getArguments()).to.deep.equal([1, 2]);
            expect(fixture.getDescription()).to.equal('test description');
            expect(fixture.getExpectation()).to.equal(3);
        });

        it('should use default name "default" when not provided', () => {
            const fixture = new Fixture();

            expect(fixture.getName()).to.equal('default');
            expect(fixture.getArguments()).to.deep.equal([]);
            expect(fixture.getDescription()).to.be.null;
            expect(fixture.getExpectation()).to.equal(Expectation.TYPE_CHECK);
        });

        it('should use default values when only name is provided', () => {
            const fixture = new Fixture('myFixture');

            expect(fixture.getName()).to.equal('myFixture');
            expect(fixture.getArguments()).to.deep.equal([]);
            expect(fixture.getDescription()).to.be.null;
            expect(fixture.getExpectation()).to.equal(Expectation.TYPE_CHECK);
        });
    });

    describe('getName()', () => {
        it('should return the fixture name', () => {
            const fixture = new Fixture('customFixture');

            expect(fixture.getName()).to.equal('customFixture');
        });
    });

    describe('getInstanceFixtureName()', () => {
        it('should return the fixture name as the instance fixture name', () => {
            const fixture = new Fixture('myFixture');

            expect(fixture.getInstanceFixtureName()).to.equal('myFixture');
        });
    });

    describe('getArguments()', () => {
        it('should return the arguments array', () => {
            const fixture = new Fixture('test', [1, 'test', true]);

            expect(fixture.getArguments()).to.deep.equal([1, 'test', true]);
        });
    });

    describe('getDescription()', () => {
        it('should return the description', () => {
            const fixture = new Fixture('test', [], 'my description');

            expect(fixture.getDescription()).to.equal('my description');
        });

        it('should return null when no description provided', () => {
            const fixture = new Fixture('test');

            expect(fixture.getDescription()).to.be.null;
        });
    });

    describe('getExpectation()', () => {
        it('should return the expectation value', () => {
            const fixture = new Fixture('test', [], null, 42);

            expect(fixture.getExpectation()).to.equal(42);
        });

        it('should return Expectation.TYPE_CHECK by default', () => {
            const fixture = new Fixture('test');

            expect(fixture.getExpectation()).to.equal(Expectation.TYPE_CHECK);
        });
    });
});
