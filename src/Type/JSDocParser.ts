/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import { Expectation } from '../Attribute/Expectation';
import { Fixture } from '../Attribute/Fixture';
import { Scenario } from '../Attribute/Scenario';
import { JSDocParserInterface } from './JSDocParserInterface';
import * as ts from 'typescript';

/**
 * Service for parsing JSDoc annotations to extract scenario and fixture metadata.
 */
export class JSDocParser implements JSDocParserInterface {
    /**
     * @inheritDoc
     */
    parseFixtures(
        node: ts.ConstructorDeclaration | ts.MethodDeclaration,
    ): Fixture[] {
        const fixtures: Fixture[] = [];
        const jsDocs = (node as any).jsDoc as ts.JSDoc[] | undefined;

        if (!jsDocs) {
            return fixtures;
        }

        for (const doc of jsDocs) {
            if (!doc.tags) {
                continue;
            }

            for (const tag of doc.tags) {
                if (tag.tagName.text === 'fixture') {
                    const fixture = this.parseFixtureTag(tag);

                    if (fixture) {
                        fixtures.push(fixture);
                    }
                }
            }
        }

        return fixtures;
    }

    /**
     * @inheritDoc
     */
    parseScenarios(
        node: ts.MethodDeclaration | ts.FunctionDeclaration,
    ): Scenario[] {
        const scenarios: Scenario[] = [];
        const jsDocs = (node as any).jsDoc as ts.JSDoc[] | undefined;

        if (!jsDocs) {
            return scenarios;
        }

        for (const doc of jsDocs) {
            if (!doc.tags) {
                continue;
            }

            for (const tag of doc.tags) {
                if (tag.tagName.text === 'scenario') {
                    const scenario = this.parseScenarioTag(tag);

                    if (scenario) {
                        scenarios.push(scenario);
                    }
                }
            }
        }

        return scenarios;
    }

    /**
     * @inheritDoc
     */
    parseSkip(
        node: ts.MethodDeclaration | ts.FunctionDeclaration,
    ): string | null {
        const jsDocs = (node as any).jsDoc as ts.JSDoc[] | undefined;

        if (!jsDocs) {
            return null;
        }

        for (const doc of jsDocs) {
            if (!doc.tags) {
                continue;
            }

            for (const tag of doc.tags) {
                if (tag.tagName.text === 'skip') {
                    const comment = tag.comment;

                    if (typeof comment === 'string') {
                        return comment || 'Skipped';
                    }

                    return 'Skipped';
                }
            }
        }

        return null;
    }

    /**
     * Parses a @fixture JSDoc tag into a Fixture object.
     * Format: @fixture name [arg1, arg2, ...]
     * or: @fixture [arg1, arg2, ...] (uses default name)
     */
    parseFixtureTag(tag: ts.JSDocTag): Fixture | null {
        const comment = tag.comment;

        if (typeof comment !== 'string') {
            return null;
        }

        // Parse the fixture comment.
        // Format: "name [args]" or "[args]"
        const match = comment.match(/^(?:(\w+)\s+)?(\[.*])$/);

        if (!match) {
            return null;
        }

        const name = match[1] || Fixture.DEFAULT_NAME;
        const argsString = match[2];

        // Parse the arguments array.
        let args: unknown[];

        try {
            args = JSON.parse(argsString);
        } catch {
            // If parsing fails, use empty array.
            // TODO: Raise as a failure.
            args = [];
        }

        return new Fixture(name, args);
    }

    /**
     * Parses a @scenario JSDoc tag into a Scenario object.
     * Format: @scenario description="..." args=[...] expect=... instance="..."
     */
    parseScenarioTag(tag: ts.JSDocTag): Scenario | null {
        const comment = tag.comment;
        if (typeof comment !== 'string') {
            return null;
        }

        // Parse the scenario attributes.
        const attributes: Record<string, unknown> = {};

        // Extract description.
        const descMatch = comment.match(/description="([^"]*)"/);
        if (descMatch) {
            attributes.description = descMatch[1];
        }

        // Extract args.
        const argsMatch = comment.match(/args=(\[[^]]*])/);
        if (argsMatch) {
            try {
                attributes.args = JSON.parse(argsMatch[1]);
            } catch {
                // TODO: Raise as a failure.
                attributes.args = [];
            }
        }

        // Extract expect.
        const expectMatch = comment.match(
            /expect=(\d+|"[^"]*"|true|false|null)/,
        );
        if (expectMatch) {
            const expectValue = expectMatch[1];
            if (expectValue === 'true') {
                attributes.expect = true;
            } else if (expectValue === 'false') {
                attributes.expect = false;
            } else if (expectValue === 'null') {
                attributes.expect = null;
            } else if (expectValue.startsWith('"')) {
                attributes.expect = expectValue.slice(1, -1);
            } else {
                attributes.expect = Number(expectValue);
            }
        }

        // Extract instance.
        const instanceMatch = comment.match(/instance="([^"]*)"/);
        if (instanceMatch) {
            attributes.instance = instanceMatch[1];
        }

        return new Scenario(
            (attributes.description as string | undefined) ?? null,
            (attributes.args as unknown[]) ?? [],
            attributes.expect ?? Expectation.TYPE_CHECK,
            (attributes.instance as string | undefined) ??
                Scenario.DEFAULT_INSTANCE,
        );
    }
}
