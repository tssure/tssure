/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { Scanner } from '../../../src/Discovery/Scanner';
import { InvalidPathError } from '../../../src/Exception/InvalidPathError';
import { expect } from 'chai';
import sinon from 'sinon';

describe('Scanner', () => {
    let scanner: Scanner;

    beforeEach(() => {
        scanner = new Scanner();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('scan()', () => {
        it('should throw InvalidPathError when path does not exist', () => {
            expect(() =>
                scanner.scan('/nonexistent/path/that/does/not/exist'),
            ).to.throw(InvalidPathError, 'Path does not exist');
        });

        it('should be an instance of Scanner', () => {
            expect(scanner).to.be.instanceOf(Scanner);
        });

        it('should have a scan method', () => {
            expect(scanner.scan).to.be.a('function');
        });
    });
});
