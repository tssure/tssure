/*
 * TSSure - Automated contract verification for TypeScript.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/tssure/tssure/
 *
 * Released under the MIT license
 * https://github.com/tssure/tssure/raw/master/MIT-LICENSE.txt
 */
import prettierConfig from 'buildbelt/prettier.config.mjs';

export default {
    ...prettierConfig,
    'plugins': ['@trivago/prettier-plugin-sort-imports'],
};
