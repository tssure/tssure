/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import buildbeltConfig from 'buildbelt/eslint.config.mjs';

export default [
    ...buildbeltConfig.map((config) => ({
        ...config,
        files: [
            '{src,test}/**/*.{js,jsx,mjs,mts,ts,tsx}',
            '*.{js,jsx,mjs,mts,ts,tsx}',
        ],
        rules: {
            ...config.rules,
            // Allow TypeScript's any type where needed for flexibility.
            '@typescript-eslint/no-explicit-any': 'off',
        },
    })),
    {
        files: ['test/**/*.{js,jsx,mjs,mts,ts,tsx}'],
        rules: {
            // Allow assertion chains such as `.to.be.null`.
            '@typescript-eslint/no-unused-expressions': 'off',
        },
    },
];
