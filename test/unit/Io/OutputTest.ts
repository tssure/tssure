/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { Output } from '../../../src/Io/Output';
import { expect } from 'chai';
import sinon from 'sinon';

describe('Output', () => {
    let stream: sinon.SinonStubbedInstance<NodeJS.WriteStream>;
    let output: Output;

    beforeEach(() => {
        stream = {
            write: sinon.stub(),
        } as unknown as sinon.SinonStubbedInstance<NodeJS.WriteStream>;
        output = new Output(stream as unknown as NodeJS.WriteStream);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('write()', () => {
        it('should write data to the stream', () => {
            output.write('Hello, world!');

            expect(stream.write.calledOnce).to.be.true;
            expect(stream.write.calledWith('Hello, world!')).to.be.true;
        });

        it('should write empty string to the stream', () => {
            output.write('');

            expect(stream.write.calledOnce).to.be.true;
            expect(stream.write.calledWith('')).to.be.true;
        });

        it('should write multiple lines to the stream', () => {
            output.write('Line 1\nLine 2\nLine 3');

            expect(stream.write.calledOnce).to.be.true;
            expect(stream.write.calledWith('Line 1\nLine 2\nLine 3')).to.be
                .true;
        });

        it('should handle multiple write calls', () => {
            output.write('First');
            output.write('Second');
            output.write('Third');

            expect(stream.write.callCount).to.equal(3);
            expect(stream.write.firstCall.calledWith('First')).to.be.true;
            expect(stream.write.secondCall.calledWith('Second')).to.be.true;
            expect(stream.write.thirdCall.calledWith('Third')).to.be.true;
        });

        it('should write special characters to the stream', () => {
            const specialChars = '\t\n\r\x1b[31mRed\x1b[0m';
            output.write(specialChars);

            expect(stream.write.calledOnce).to.be.true;
            expect(stream.write.calledWith(specialChars)).to.be.true;
        });

        it('should write unicode characters to the stream', () => {
            const unicode = '✓ Test passed 🎉';
            output.write(unicode);

            expect(stream.write.calledOnce).to.be.true;
            expect(stream.write.calledWith(unicode)).to.be.true;
        });
    });
});
