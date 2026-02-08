/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { TypeAsserterInterface } from '../../../src/Assert/TypeAsserterInterface';
import { Expectation } from '../../../src/Attribute/Expectation';
import { Scenario } from '../../../src/Attribute/Scenario';
import { MethodInfo } from '../../../src/Discovery/MethodInfo';
import { TestExecutor } from '../../../src/Execution/TestExecutor';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as ts from 'typescript';

describe('TestExecutor', () => {
    let typeAsserter: sinon.SinonStubbedInstance<TypeAsserterInterface>;
    let executor: TestExecutor;
    let typeChecker: sinon.SinonStubbedInstance<ts.TypeChecker>;

    beforeEach(() => {
        typeAsserter = {
            assertMatches: sinon.stub(),
        } as any;
        executor = new TestExecutor(typeAsserter);
        typeChecker = sinon.createStubInstance(Object as any) as any;
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('executeMethodScenarios()', () => {
        it('should add skip result for each scenario when method is skipped', () => {
            const methodNode = {
                type: {},
            } as any;
            const scenario1 = new Scenario('scenario 1', [5], 10, 'default');
            const scenario2 = new Scenario('scenario 2', [10], 20, 'default');
            const method = new MethodInfo(
                'testMethod',
                [scenario1, scenario2],
                methodNode,
                false,
                'Work in progress',
            );

            const passes: any[] = [];
            const failures: any[] = [];
            const skips: any[] = [];
            const fixtureInstances = new Map();

            executor.executeMethodScenarios(
                'TestClass',
                method,
                fixtureInstances,
                {},
                typeChecker,
                passes,
                failures,
                skips,
            );

            expect(passes).to.have.lengthOf(0);
            expect(failures).to.have.lengthOf(0);
            expect(skips).to.have.lengthOf(2);
            expect(skips[0].identifier).to.equal(
                'TestClass.testMethod - scenario 1',
            );
            expect(skips[0].message).to.equal('Work in progress');
            expect(skips[1].identifier).to.equal(
                'TestClass.testMethod - scenario 2',
            );
            expect(skips[1].message).to.equal('Work in progress');
        });

        it('should use default skip message when skip reason is null', () => {
            const methodNode = {
                type: {},
            } as any;
            const scenario = new Scenario('test scenario', [5], 10, 'default');
            const method = new MethodInfo(
                'testMethod',
                [scenario],
                methodNode,
                false,
                '',
            );
            const passes: any[] = [];
            const failures: any[] = [];
            const skips: any[] = [];
            const fixtureInstances = new Map();

            executor.executeMethodScenarios(
                'TestClass',
                method,
                fixtureInstances,
                {},
                typeChecker,
                passes,
                failures,
                skips,
            );

            expect(skips).to.have.lengthOf(1);
            expect(skips[0].message).to.equal('Skipped');
        });

        it('should execute scenario when method is not skipped', () => {
            const methodNode = {
                type: {},
            } as any;
            const scenario = new Scenario('test scenario', [5], 10, 'default');
            const method = new MethodInfo(
                'testMethod',
                [scenario],
                methodNode,
                false,
                null,
            );
            const passes: any[] = [];
            const failures: any[] = [];
            const skips: any[] = [];
            const mockInstance = {
                testMethod: (value: number) => value * 2,
            };
            const fixtureInstances = new Map([['default', mockInstance]]);
            const mockClass = class TestClass {};

            executor.executeMethodScenarios(
                'TestClass',
                method,
                fixtureInstances,
                mockClass,
                typeChecker,
                passes,
                failures,
                skips,
            );

            expect(passes).to.have.lengthOf(1);
            expect(failures).to.have.lengthOf(0);
            expect(skips).to.have.lengthOf(0);
        });

        it('should add failure when fixture not found for instance method', () => {
            const methodNode = {
                type: {},
            } as any;
            const scenario = new Scenario('test scenario', [5], 10, 'missing');
            const method = new MethodInfo(
                'testMethod',
                [scenario],
                methodNode,
                false,
                null,
            );
            const passes: any[] = [];
            const failures: any[] = [];
            const skips: any[] = [];
            const fixtureInstances = new Map();
            const mockClass = class TestClass {};

            executor.executeMethodScenarios(
                'TestClass',
                method,
                fixtureInstances,
                mockClass,
                typeChecker,
                passes,
                failures,
                skips,
            );

            expect(passes).to.have.lengthOf(0);
            expect(failures).to.have.lengthOf(1);
            expect(failures[0].identifier).to.equal(
                'TestClass.testMethod - test scenario',
            );
            expect(failures[0].message).to.include(
                'Fixture "missing" not found',
            );
            expect(skips).to.have.lengthOf(0);
        });

        it('should add failure when method is not a function', () => {
            const methodNode = {
                type: {},
            } as any;
            const scenario = new Scenario('test scenario', [5], 10, 'default');
            const method = new MethodInfo(
                'testMethod',
                [scenario],
                methodNode,
                false,
                null,
            );
            const passes: any[] = [];
            const failures: any[] = [];
            const skips: any[] = [];
            const mockInstance = {
                testMethod: 'not a function',
            };
            const fixtureInstances = new Map([['default', mockInstance]]);
            const mockClass = class TestClass {};

            executor.executeMethodScenarios(
                'TestClass',
                method,
                fixtureInstances,
                mockClass,
                typeChecker,
                passes,
                failures,
                skips,
            );

            expect(passes).to.have.lengthOf(0);
            expect(failures).to.have.lengthOf(1);
            expect(failures[0].message).to.include(
                'Method "testMethod" not found or not a function',
            );
            expect(skips).to.have.lengthOf(0);
        });

        it('should execute static method from class constructor', () => {
            const methodNode = {
                type: {},
            } as any;
            const scenario = new Scenario('test scenario', [5], 10, 'default');
            const method = new MethodInfo(
                'testMethod',
                [scenario],
                methodNode,
                true,
                null,
            );
            const passes: any[] = [];
            const failures: any[] = [];
            const skips: any[] = [];
            const fixtureInstances = new Map();
            const mockClass = class TestClass {
                static testMethod(value: number): number {
                    return value * 2;
                }
            };

            executor.executeMethodScenarios(
                'TestClass',
                method,
                fixtureInstances,
                mockClass,
                typeChecker,
                passes,
                failures,
                skips,
            );

            expect(passes).to.have.lengthOf(1);
            expect(failures).to.have.lengthOf(0);
            expect(skips).to.have.lengthOf(0);
        });

        it('should add pass result when value matches expectation', () => {
            const methodNode = {
                type: {},
            } as any;
            const scenario = new Scenario('test scenario', [5], 10, 'default');
            const method = new MethodInfo(
                'testMethod',
                [scenario],
                methodNode,
                false,
                null,
            );
            const passes: any[] = [];
            const failures: any[] = [];
            const skips: any[] = [];
            const mockInstance = {
                testMethod: (value: number) => value * 2,
            };
            const fixtureInstances = new Map([['default', mockInstance]]);
            const mockClass = class TestClass {};

            executor.executeMethodScenarios(
                'TestClass',
                method,
                fixtureInstances,
                mockClass,
                typeChecker,
                passes,
                failures,
                skips,
            );

            expect(passes).to.have.lengthOf(1);
            expect(passes[0].identifier).to.include('value check passed');
            expect(failures).to.have.lengthOf(0);
            expect(skips).to.have.lengthOf(0);
        });

        it('should add failure when value does not match expectation', () => {
            const methodNode = {
                type: {},
            } as any;
            const scenario = new Scenario('test scenario', [5], 15, 'default');
            const method = new MethodInfo(
                'testMethod',
                [scenario],
                methodNode,
                false,
                null,
            );
            const passes: any[] = [];
            const failures: any[] = [];
            const skips: any[] = [];
            const mockInstance = {
                testMethod: (value: number) => value * 2,
            };
            const fixtureInstances = new Map([['default', mockInstance]]);
            const mockClass = class TestClass {};

            executor.executeMethodScenarios(
                'TestClass',
                method,
                fixtureInstances,
                mockClass,
                typeChecker,
                passes,
                failures,
                skips,
            );

            expect(passes).to.have.lengthOf(0);
            expect(failures).to.have.lengthOf(1);
            expect(failures[0].message).to.include('Expected 15, got 10');
            expect(skips).to.have.lengthOf(0);
        });

        it('should perform type check when expectation is TYPE_CHECK', () => {
            const methodNode = {
                type: {},
            } as any;
            const scenario = new Scenario(
                'test scenario',
                [5],
                Expectation.TYPE_CHECK,
                'default',
            );
            const method = new MethodInfo(
                'testMethod',
                [scenario],
                methodNode,
                false,
                null,
            );
            const passes: any[] = [];
            const failures: any[] = [];
            const skips: any[] = [];
            const mockInstance = {
                testMethod: (value: number) => value * 2,
            };
            const fixtureInstances = new Map([['default', mockInstance]]);
            const mockClass = class TestClass {};

            (typeChecker.getTypeAtLocation as any) = sinon
                .stub()
                .returns({} as any);

            executor.executeMethodScenarios(
                'TestClass',
                method,
                fixtureInstances,
                mockClass,
                typeChecker,
                passes,
                failures,
                skips,
            );

            expect(passes).to.have.lengthOf(1);
            expect(passes[0].identifier).to.include('type check passed');
            expect(typeAsserter.assertMatches).to.have.been.calledOnce;
            expect(failures).to.have.lengthOf(0);
            expect(skips).to.have.lengthOf(0);
        });

        it('should add failure when test execution throws error', () => {
            const methodNode = {
                type: {},
            } as any;
            const scenario = new Scenario('test scenario', [5], 10, 'default');
            const method = new MethodInfo(
                'testMethod',
                [scenario],
                methodNode,
                false,
                null,
            );
            const passes: any[] = [];
            const failures: any[] = [];
            const skips: any[] = [];
            const mockInstance = {
                testMethod: () => {
                    throw new Error('Test error');
                },
            };
            const fixtureInstances = new Map([['default', mockInstance]]);
            const mockClass = class TestClass {};

            executor.executeMethodScenarios(
                'TestClass',
                method,
                fixtureInstances,
                mockClass,
                typeChecker,
                passes,
                failures,
                skips,
            );

            expect(passes).to.have.lengthOf(0);
            expect(failures).to.have.lengthOf(1);
            expect(failures[0].message).to.include('Test execution failed');
            expect(failures[0].message).to.include('Test error');
            expect(skips).to.have.lengthOf(0);
        });
    });
});
