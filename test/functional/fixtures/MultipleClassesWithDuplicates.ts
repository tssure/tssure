/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { TypedSure } from '../../../src/Type/TypedSure';

/**
 * First test class with duplicate fixture names.
 */
export class FirstClassWithDuplicates {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    getValue(): TypedSure<
        number,
        {
            fixtures: [{ args: [] }, { args: [] }];
        }
    > {
        return this.value;
    }
}

/**
 * Second test class with duplicate fixture names.
 */
export class SecondClassWithDuplicates {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    getName(): TypedSure<
        string,
        {
            fixtures: [{ name: 'same'; args: [] }, { name: 'same'; args: [] }];
        }
    > {
        return this.name;
    }
}

/**
 * Third test class with valid unique fixtures (should not fail).
 */
export class ThirdClassWithValidFixtures {
    private count: number;

    constructor(count: number) {
        this.count = count;
    }

    getCount(): TypedSure<
        number,
        {
            fixtures: [
                { name: 'default'; args: [] },
                { name: 'custom'; args: [] },
            ];
        }
    > {
        return this.count;
    }
}
