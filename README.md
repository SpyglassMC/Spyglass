# datapack-language-server

[![CircleCI](https://img.shields.io/circleci/build/github/SPGoding/datapack-language-server.svg?logo=circleci&style=flat-square)](https://circleci.com/gh/SPGoding/datapack-language-server)
[![npm](https://img.shields.io/npm/v/datapack-language-server.svg?logo=npm&style=flat-square)](https://npmjs.com/package/datapack-language-server)
[![Codecov](https://img.shields.io/codecov/c/gh/SPGoding/datapack-language-server.svg?logo=codecov&style=flat-square)](https://codecov.io/gh/SPGoding/datapack-language-server)
[![License](https://img.shields.io/github/license/SPGoding/datapack-language-server.svg?style=flat-square)](https://github.com/SPGoding/datapack-language-server/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.carloscuesta.me/)

Language server for Minecraft: Java Edition datapacks.

## _Todo_

### Lint Rules

There are lots of lint rules which can help format your commands.

#### blockStateAppendSpaceAfterComma: `boolean`

Whether to append spaces after commas in block states or not.  
@default `false`

#### blockStatePutSpacesAroundEqualSign: `boolean`

Whether to put spaces around equal signs in block states or not.  
@default `false`

#### blockStateSortKeys: `boolean`

Whether to sort the keys in block states or not.  
@default `false`

#### quoteType: `'always single' | 'always double' | 'prefer single' | 'prefer double'`

Quotes used in NBT strings and phrase strings.  
`'always single'`: Always use single quotes.  
`'always double'`: Always use double quotes.  
`'prefer single'`: Always use single quotes, unless there are single quotes in the string.  
`'prefer double'`: Always use double quotes, unless there are double quotes in the string.  
@default `'prefer double'`  

#### quoteEntitySelectorStrings: `boolean`

When the strings in entity selectors should be quoted.  
`true`: Always.  
`false`: Only when there are special characters in the string.  
@default `false`

#### quoteSnbtStringKeys: `boolean`

When the string keys in SNBTs should be quoted.  
`true`: Always.  
`false`: Only when there are special characters in the string.  
@default `false`

#### quoteNbtStringValues: `boolean`

When the string values in SNBTs should be quoted.  
`true`: Always.  
`false`: Only when there are special characters in the string.  
@default `true`

#### snbtAppendSpaceAfterColon: `boolean`

Whether to append spaces after colons in SNBTs or not.  
@default `true`

#### snbtAppendSpaceAfterComma: `boolean`

Whether to append spaces after commas in SNBT or not.  
@default `true`

#### snbtAppendSpaceAfterSemicolon: `boolean`

Whether to append spaces after semicolons in SNBTs or not.  
@default `true`

#### snbtByteSuffix: `'b' | 'B'`

The suffix used for TAG_Byte in SNBTs.  
@default `'b'`

#### snbtUseBooleans: `boolean`

Whether `0b` and `1b` should be represents by `false` and `true` in SNBTs or not.  
@default `false`

#### snbtShortSuffix: `'s' | 'S'`

The suffix used for TAG_Short in SNBTs.  
@default `'s'`

#### snbtLongSuffix: `'l' | 'L'`

The suffix used for TAG_Long in SNBTs.  
@default `'L'`

#### snbtFloatSuffix: `'f' | 'F'`

The suffix used for TAG_Float in SNBTs.  
@default `'f'`

#### snbtDoubleSuffix: `'d' | 'D'`

The suffix used for TAG_Double in SNBTs.  
@default `'d'`

#### snbtOmitDoubleSuffix: `boolean`

Whether to omit the suffix of double numbers when possible in SNBTs or not.  
@default `false`

#### snbtKeepDecimalPlace: `boolean`

Whether to keep at least one decimal place in SNBTs or not.  
@default `true`

#### snbtSortKeys: `boolean`

Whether to sort keys in compound tags in SNBTs or not.  
@default `false`

#### timeOmitTickUnit: boolean

Whether to omit the unit of tick (`t`) in time arguments.  
@default `false`

#### nameOfTags: `NamingConventionConfig`

The naming convension for scoreboard tags.  
@default `'whatever'`

#### nameOfObjectives: `NamingConventionConfig`

The naming convension for scoreboard objectives.  
@default `'whatever'`

#### nameOfSnbtCompoundTagKeys: `NamingConventionConfig`

The naming convension for compound tag keys in SNBTs.  
@default `['PascalCase', 'camelCase']`

<!-- #### strictBossbarCheck: boolean

Whether to throw warnings for undefined bossbars.  
@default `false` -->

#### strictObjectiveCheck: boolean

Whether to throw warnings for undefined objectives.  
@default `false`

#### strictTagCheck: boolean

Whether to throw warnings for undefined tags.  
@default `false`

#### strictTeamCheck: boolean

Whether to throw warnings for undefined teams.  
@default `false`

#### omitDefaultNamespace: boolean

Whether to omit default namespace (`minecraft`) in namespaced IDs.  
Does NOT affect namespaced IDs in NBT strings.  
@default `false`

<!-- #### vectorKeepDecimalPlace: boolean

Whether to keep at least one decimal place in vectors or not.  
If sets to `false`, the decimal place will still be kept to avoid center-correcting when necessary.  
@default `true` -->

## Contributing

Contributions are welcome!

## Sponsers

- 夏白千层心
- 爱发电用户_4vCR
- uuu2011
- Ganxiaozhe
