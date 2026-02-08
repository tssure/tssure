#!/usr/bin/env node
/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */

// Use require() for runtime module resolution to compiled dist/ files.
// eslint-disable @typescript-eslint/no-require-imports

// Register ts-node for TypeScript support.
// This allows .ts files to be loaded and executed for verification.
require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
        module: 'commonjs',
    },
});

const { TypeAsserter } = require('./Assert/TypeAsserter');
const { ScanCommand } = require('./Bin/ScanCommand');
const { TSSureBinary } = require('./Bin/TSSureBinary');
const { ClassDiscoverer } = require('./Discovery/ClassDiscoverer');
const { Scanner } = require('./Discovery/Scanner');
const { TestExecutor } = require('./Execution/TestExecutor');
const { Output } = require('./Io/Output');
const { Runner } = require('./Runner/Runner');
const { CombinedParser } = require('./Type/CombinedParser');
const { JSDocParser } = require('./Type/JSDocParser');
const { TypedSureParser } = require('./Type/TypedSureParser');
const { FixtureValidator } = require('./Validation/FixtureValidator');

const scanner = new Scanner();
const jsDocParser = new JSDocParser();
const typedSureParser = new TypedSureParser();
const parser = new CombinedParser(jsDocParser, typedSureParser);
const classDiscoverer = new ClassDiscoverer(parser);
const fixtureValidator = new FixtureValidator();
const typeAsserter = new TypeAsserter();
const testExecutor = new TestExecutor(typeAsserter);
const runner = new Runner(
    scanner,
    classDiscoverer,
    fixtureValidator,
    testExecutor,
);
const stdout = new Output(process.stdout);
const stderr = new Output(process.stderr);
const scanCommand = new ScanCommand(runner, stdout, stderr);
const binary = new TSSureBinary(scanCommand, stdout, stderr);

const exitCode = binary.run(process.argv);

process.exit(exitCode);
