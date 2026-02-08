/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { TypeAsserter } from '../../../src/Assert/TypeAsserter';
import { TypeMismatchError } from '../../../src/Exception/TypeMismatchError';
import { UnsupportedTypeError } from '../../../src/Exception/UnsupportedTypeError';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as ts from 'typescript';

describe('TypeAsserter', () => {
    let typeAsserter: TypeAsserter;
    let typeChecker: ts.TypeChecker;
    let mockType: ts.Type;

    beforeEach(() => {
        typeAsserter = new TypeAsserter();
        typeChecker = {
            typeToString: sinon.stub(),
        } as any;
        mockType = {
            isUnion: () => false,
            isIntersection: () => false,
        } as any;
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('assertMatches()', () => {
        describe('with null and undefined values', () => {
            it('should accept null when type allows null', () => {
                mockType.flags = ts.TypeFlags.Null;
                (typeChecker.typeToString as sinon.SinonStub).returns('null');

                expect(() =>
                    typeAsserter.assertMatches(null, mockType, typeChecker),
                ).not.to.throw();
            });

            it('should accept undefined when type allows undefined', () => {
                mockType.flags = ts.TypeFlags.Undefined;
                (typeChecker.typeToString as sinon.SinonStub).returns(
                    'undefined',
                );

                expect(() =>
                    typeAsserter.assertMatches(
                        undefined,
                        mockType,
                        typeChecker,
                    ),
                ).not.to.throw();
            });

            it('should accept null when type is void', () => {
                mockType.flags = ts.TypeFlags.Void;
                (typeChecker.typeToString as sinon.SinonStub).returns('void');

                expect(() =>
                    typeAsserter.assertMatches(null, mockType, typeChecker),
                ).not.to.throw();
            });

            it('should accept null when type is any', () => {
                mockType.flags = ts.TypeFlags.Any;
                (typeChecker.typeToString as sinon.SinonStub).returns('any');

                expect(() =>
                    typeAsserter.assertMatches(null, mockType, typeChecker),
                ).not.to.throw();
            });

            it('should accept null when type is a union including null', () => {
                const nullType = { flags: ts.TypeFlags.Null } as ts.Type;
                const stringType = { flags: ts.TypeFlags.String } as ts.Type;
                mockType.flags = ts.TypeFlags.Union;
                (mockType as any).types = [stringType, nullType];
                (mockType as any).isUnion = () => true;
                (typeChecker.typeToString as sinon.SinonStub).returns(
                    'string | null',
                );

                expect(() =>
                    typeAsserter.assertMatches(null, mockType, typeChecker),
                ).not.to.throw();
            });

            it('should reject null when type does not allow null', () => {
                mockType.flags = ts.TypeFlags.String;
                (mockType as any).isUnion = () => false;
                (typeChecker.typeToString as sinon.SinonStub).returns('string');

                expect(() =>
                    typeAsserter.assertMatches(null, mockType, typeChecker),
                ).to.throw(TypeMismatchError, 'Expected string, got null');
            });

            it('should reject undefined when type does not allow undefined', () => {
                mockType.flags = ts.TypeFlags.Number;
                (mockType as any).isUnion = () => false;
                (typeChecker.typeToString as sinon.SinonStub).returns('number');

                expect(() =>
                    typeAsserter.assertMatches(
                        undefined,
                        mockType,
                        typeChecker,
                    ),
                ).to.throw(TypeMismatchError, 'Expected number, got undefined');
            });
        });

        describe('with any type', () => {
            it('should accept any value when type is any', () => {
                mockType.flags = ts.TypeFlags.Any;
                (typeChecker.typeToString as sinon.SinonStub).returns('any');

                expect(() =>
                    typeAsserter.assertMatches(42, mockType, typeChecker),
                ).not.to.throw();
                expect(() =>
                    typeAsserter.assertMatches('test', mockType, typeChecker),
                ).not.to.throw();
                expect(() =>
                    typeAsserter.assertMatches(true, mockType, typeChecker),
                ).not.to.throw();
                expect(() =>
                    typeAsserter.assertMatches({}, mockType, typeChecker),
                ).not.to.throw();
            });
        });

        describe('with string type', () => {
            beforeEach(() => {
                mockType.flags = ts.TypeFlags.String;
                (typeChecker.typeToString as sinon.SinonStub).returns('string');
            });

            it('should accept string values', () => {
                expect(() =>
                    typeAsserter.assertMatches('hello', mockType, typeChecker),
                ).not.to.throw();
                expect(() =>
                    typeAsserter.assertMatches('', mockType, typeChecker),
                ).not.to.throw();
            });

            it('should reject number values with exact error message', () => {
                expect(() =>
                    typeAsserter.assertMatches(42, mockType, typeChecker),
                ).to.throw(TypeMismatchError, 'Expected string, got number');
            });

            it('should reject boolean values with exact error message', () => {
                expect(() =>
                    typeAsserter.assertMatches(true, mockType, typeChecker),
                ).to.throw(TypeMismatchError, 'Expected string, got boolean');
            });

            it('should reject object values with exact error message', () => {
                expect(() =>
                    typeAsserter.assertMatches({}, mockType, typeChecker),
                ).to.throw(TypeMismatchError, 'Expected string, got object');
            });
        });

        describe('with number type', () => {
            beforeEach(() => {
                mockType.flags = ts.TypeFlags.Number;
                (typeChecker.typeToString as sinon.SinonStub).returns('number');
            });

            it('should accept number values', () => {
                expect(() =>
                    typeAsserter.assertMatches(42, mockType, typeChecker),
                ).not.to.throw();
                expect(() =>
                    typeAsserter.assertMatches(0, mockType, typeChecker),
                ).not.to.throw();
                expect(() =>
                    typeAsserter.assertMatches(-3.14, mockType, typeChecker),
                ).not.to.throw();
            });

            it('should reject string values with exact error message', () => {
                expect(() =>
                    typeAsserter.assertMatches('42', mockType, typeChecker),
                ).to.throw(TypeMismatchError, 'Expected number, got string');
            });

            it('should reject boolean values with exact error message', () => {
                expect(() =>
                    typeAsserter.assertMatches(false, mockType, typeChecker),
                ).to.throw(TypeMismatchError, 'Expected number, got boolean');
            });
        });

        describe('with boolean type', () => {
            beforeEach(() => {
                mockType.flags = ts.TypeFlags.Boolean;
                (typeChecker.typeToString as sinon.SinonStub).returns(
                    'boolean',
                );
            });

            it('should accept boolean values', () => {
                expect(() =>
                    typeAsserter.assertMatches(true, mockType, typeChecker),
                ).not.to.throw();
                expect(() =>
                    typeAsserter.assertMatches(false, mockType, typeChecker),
                ).not.to.throw();
            });

            it('should reject string values with exact error message', () => {
                expect(() =>
                    typeAsserter.assertMatches('true', mockType, typeChecker),
                ).to.throw(TypeMismatchError, 'Expected boolean, got string');
            });

            it('should reject number values with exact error message', () => {
                expect(() =>
                    typeAsserter.assertMatches(1, mockType, typeChecker),
                ).to.throw(TypeMismatchError, 'Expected boolean, got number');
            });
        });

        describe('with union types', () => {
            it('should accept value matching first union member', () => {
                const stringType = { flags: ts.TypeFlags.String } as ts.Type;
                const numberType = { flags: ts.TypeFlags.Number } as ts.Type;
                mockType.flags = ts.TypeFlags.Union;
                (mockType as any).types = [stringType, numberType];
                (mockType as any).isUnion = () => true;
                (typeChecker.typeToString as sinon.SinonStub).returns(
                    'string | number',
                );

                expect(() =>
                    typeAsserter.assertMatches('test', mockType, typeChecker),
                ).not.to.throw();
            });

            it('should accept value matching second union member', () => {
                const stringType = { flags: ts.TypeFlags.String } as ts.Type;
                const numberType = { flags: ts.TypeFlags.Number } as ts.Type;
                mockType.flags = ts.TypeFlags.Union;
                (mockType as any).types = [stringType, numberType];
                (mockType as any).isUnion = () => true;
                (typeChecker.typeToString as sinon.SinonStub).returns(
                    'string | number',
                );

                expect(() =>
                    typeAsserter.assertMatches(42, mockType, typeChecker),
                ).not.to.throw();
            });

            it('should reject value not matching any union member with exact error message', () => {
                const stringType = { flags: ts.TypeFlags.String } as ts.Type;
                const numberType = { flags: ts.TypeFlags.Number } as ts.Type;
                mockType.flags = ts.TypeFlags.Union;
                (mockType as any).types = [stringType, numberType];
                (mockType as any).isUnion = () => true;
                (typeChecker.typeToString as sinon.SinonStub).returns(
                    'string | number',
                );

                expect(() =>
                    typeAsserter.assertMatches(true, mockType, typeChecker),
                ).to.throw(
                    TypeMismatchError,
                    'Value does not match any type in union string | number',
                );
            });
        });

        describe('with intersection types', () => {
            it('should accept value matching all intersection members', () => {
                const objectType1 = {
                    flags: ts.TypeFlags.Object,
                    isUnion: () => false,
                    isIntersection: () => false,
                } as any;
                const objectType2 = {
                    flags: ts.TypeFlags.Object,
                    isUnion: () => false,
                    isIntersection: () => false,
                } as any;
                mockType.flags = ts.TypeFlags.Intersection;
                (mockType as any).types = [objectType1, objectType2];
                (mockType as any).isIntersection = () => true;
                (typeChecker.typeToString as sinon.SinonStub).returns(
                    'Type1 & Type2',
                );

                expect(() =>
                    typeAsserter.assertMatches({}, mockType, typeChecker),
                ).not.to.throw();
            });

            it('should reject value not matching all intersection members', () => {
                const stringType = { flags: ts.TypeFlags.String } as ts.Type;
                const numberType = { flags: ts.TypeFlags.Number } as ts.Type;
                mockType.flags = ts.TypeFlags.Intersection;
                (mockType as any).types = [stringType, numberType];
                (mockType as any).isIntersection = () => true;
                (typeChecker.typeToString as sinon.SinonStub).returns(
                    'string & number',
                );

                expect(() =>
                    typeAsserter.assertMatches('test', mockType, typeChecker),
                ).to.throw(TypeMismatchError);
            });
        });

        describe('with object types', () => {
            it('should accept object values', () => {
                mockType.flags = ts.TypeFlags.Object;
                (mockType as any).symbol = { getName: () => 'MyClass' };
                (typeChecker.typeToString as sinon.SinonStub).returns(
                    'MyClass',
                );

                expect(() =>
                    typeAsserter.assertMatches({}, mockType, typeChecker),
                ).not.to.throw();
            });

            it('should reject non-object values with exact error message', () => {
                mockType.flags = ts.TypeFlags.Object;
                (typeChecker.typeToString as sinon.SinonStub).returns('object');

                expect(() =>
                    typeAsserter.assertMatches('test', mockType, typeChecker),
                ).to.throw(TypeMismatchError, 'Expected object, got string');
            });

            it('should reject null for object type with exact error message', () => {
                mockType.flags = ts.TypeFlags.Object;
                (typeChecker.typeToString as sinon.SinonStub).returns('object');

                expect(() =>
                    typeAsserter.assertMatches(null, mockType, typeChecker),
                ).to.throw(TypeMismatchError, 'Expected object, got null');
            });

            it('should validate "this" type with class context', () => {
                class TestClass {}
                const instance = new TestClass();

                mockType.flags = ts.TypeFlags.Object;
                (mockType as any).symbol = { getName: () => '__type' };
                (typeChecker.typeToString as sinon.SinonStub).returns('this');

                expect(() =>
                    typeAsserter.assertMatches(
                        instance,
                        mockType,
                        typeChecker,
                        TestClass,
                    ),
                ).not.to.throw();
            });

            it('should reject wrong instance for "this" type with exact error message', () => {
                class TestClass {}
                class OtherClass {}
                const instance = new OtherClass();

                mockType.flags = ts.TypeFlags.Object;
                (mockType as any).symbol = { getName: () => '__type' };
                (typeChecker.typeToString as sinon.SinonStub).returns('this');

                expect(() =>
                    typeAsserter.assertMatches(
                        instance,
                        mockType,
                        typeChecker,
                        TestClass,
                    ),
                ).to.throw(
                    TypeMismatchError,
                    'Expected instance of TestClass, got OtherClass',
                );
            });
        });

        describe('with unsupported types', () => {
            it('should throw UnsupportedTypeError for unknown type flags', () => {
                mockType.flags = ts.TypeFlags.Never;
                (mockType as any).isUnion = () => false;
                (mockType as any).isIntersection = () => false;
                (typeChecker.typeToString as sinon.SinonStub).returns('never');

                expect(() =>
                    typeAsserter.assertMatches(42, mockType, typeChecker),
                ).to.throw(
                    UnsupportedTypeError,
                    'Unsupported type for runtime validation: never',
                );
            });
        });

        describe('TypeMismatchError details', () => {
            it('should include expected type in error', () => {
                mockType.flags = ts.TypeFlags.String;
                (typeChecker.typeToString as sinon.SinonStub).returns('string');

                try {
                    typeAsserter.assertMatches(42, mockType, typeChecker);
                    expect.fail('Should have thrown TypeMismatchError');
                } catch (error) {
                    expect(error).to.be.instanceOf(TypeMismatchError);
                    expect((error as TypeMismatchError).expectedType).to.equal(
                        'string',
                    );
                }
            });

            it('should include actual value in error', () => {
                mockType.flags = ts.TypeFlags.String;
                (typeChecker.typeToString as sinon.SinonStub).returns('string');

                try {
                    typeAsserter.assertMatches(42, mockType, typeChecker);
                    expect.fail('Should have thrown TypeMismatchError');
                } catch (error) {
                    expect(error).to.be.instanceOf(TypeMismatchError);
                    expect((error as TypeMismatchError).actualValue).to.equal(
                        42,
                    );
                }
            });
        });
    });
});
