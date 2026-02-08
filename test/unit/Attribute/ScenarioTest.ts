/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { Expectation } from '../../../src/Attribute/Expectation';
import { Scenario } from '../../../src/Attribute/Scenario';
import { expect } from 'chai';

describe('Scenario', () => {
    describe('constructor()', () => {
        it('should create a scenario with all parameters', () => {
            const scenario = new Scenario('test scenario', [1, 2], 3, 'custom');

            expect(scenario.getDescription()).to.equal('test scenario');
            expect(scenario.getArguments()).to.deep.equal([1, 2]);
            expect(scenario.getExpectation()).to.equal(3);
            expect(scenario.getInstanceFixtureName()).to.equal('custom');
        });

        it('should use default values when not provided', () => {
            const scenario = new Scenario();

            expect(scenario.getDescription()).to.be.null;
            expect(scenario.getArguments()).to.deep.equal([]);
            expect(scenario.getExpectation()).to.equal(Expectation.TYPE_CHECK);
            expect(scenario.getInstanceFixtureName()).to.equal('default');
        });
    });

    describe('getDescription()', () => {
        it('should return the description', () => {
            const scenario = new Scenario('my description');

            expect(scenario.getDescription()).to.equal('my description');
        });

        it('should return null when no description provided', () => {
            const scenario = new Scenario();

            expect(scenario.getDescription()).to.be.null;
        });
    });

    describe('getArguments()', () => {
        it('should return the arguments array', () => {
            const scenario = new Scenario(null, [1, 'test', true]);

            expect(scenario.getArguments()).to.deep.equal([1, 'test', true]);
        });

        it('should return empty array when no arguments provided', () => {
            const scenario = new Scenario();

            expect(scenario.getArguments()).to.deep.equal([]);
        });
    });

    describe('getExpectation()', () => {
        it('should return the expectation value', () => {
            const scenario = new Scenario(null, [], 42);

            expect(scenario.getExpectation()).to.equal(42);
        });

        it('should return Expectation.TYPE_CHECK by default', () => {
            const scenario = new Scenario();

            expect(scenario.getExpectation()).to.equal(Expectation.TYPE_CHECK);
        });
    });

    describe('getInstanceFixtureName()', () => {
        it('should return the instance fixture name', () => {
            const scenario = new Scenario(null, [], 'type check', 'myFixture');

            expect(scenario.getInstanceFixtureName()).to.equal('myFixture');
        });

        it('should return "default" by default', () => {
            const scenario = new Scenario();

            expect(scenario.getInstanceFixtureName()).to.equal('default');
        });
    });

    describe('DEFAULT_INSTANCE', () => {
        it('should have the correct default instance name', () => {
            expect(Scenario.DEFAULT_INSTANCE).to.equal('default');
        });
    });
});
