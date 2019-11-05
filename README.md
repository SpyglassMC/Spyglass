# datapack-language-server

[![CircleCI](https://img.shields.io/circleci/build/github/SPGoding/datapack-language-server.svg?logo=circleci&style=flat-square)](https://circleci.com/gh/SPGoding/datapack-language-server)
[![npm](https://img.shields.io/npm/v/datapack-language-server.svg?logo=npm&style=flat-square)](https://npmjs.com/package/datapack-language-server)
[![Codecov](https://img.shields.io/codecov/c/gh/SPGoding/datapack-language-server.svg?logo=codecov&style=flat-square)](https://codecov.io/gh/SPGoding/datapack-language-server)
[![License](https://img.shields.io/github/license/SPGoding/datapack-language-server.svg?style=flat-square)](https://github.com/SPGoding/datapack-language-server/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.carloscuesta.me/)

Language server for Minecraft: Java Edition datapacks.

# Features

## Semantic Highlighting

Nope. I follow the spirit of [no code](https://github.com/kelseyhightower/nocode) project so I wrote no code about semantic coloring. There won't be any issues about it, yah!

Just joking. Semantic highlighting will be implemented whenever https://github.com/microsoft/vscode-languageserver-node/pull/367 is resolved. Before that, I recommend to use [Arcensoth](https://github.com/Arcensoth)'s [language-mcfunction](https://marketplace.visualstudio.com/items?itemName=arcensoth.language-mcfunction) extension.

## Completions

The extension can compute completions as you typing commands. Completions will automatically show if you commit one of these characters: `[' ', ',', '{', '[', '=', ':', '/', '@', '\n', '!', "'", '"']`. Alternatively you can use Ctrl + Space (or other configured hotkey) to show completions manually. Note: completions are not available everywhere. Typically only the beginnings of arguments and literals are supported.

DHP can provide completions for simple literals:
![literal]()

For complex entity selectors:
![selector]()

For more complex NBTs:
![nbt]()

FOR NBTS IN COMMANDS IN JSON TEXT COMPONENTS IN ITEM TAG NBTS, HANDLING THE ANOYYING ESCAPE AUTOMATICALLY FOR YOU:
![ohhhhhh]()

## Folding Ranges

You can use comments to create folding ranges, which makes the structure of mcfunction file much clearer. 

```mcfunction
#region This is a block of commands
execute if score @s test matches 1 run say 1
execute if score @s test matches 2 run say 2
execute if score @s test matches 3 run say 3
execute if score @s test matches 4 run say 4
execute if score @s test matches 5 run say 5
#endregion
```

![folding-region]()

## Diagnostics

DHP provides real-time diagnostics about your commands. It can show syntax errors as Minecraft does, and even give your more detailed warnings.

![permission-level]()
![fill-out-of-range]()

## Hover Information

DHP shows user-defined documentation when you hover on specific arguments, e.g. on function namespaced IDs, tags, teams, etc.

![hover-on-function]()

## Resolving Namespaced IDs

You can navigate to advancements, loot tables, functions, predicates and all kinds of tags by Ctrl-clicking on their namespaced IDs.

![navigate-to-predicate]()

## Goto Definitions

You can goto the definitions of entities, tags, teams, bossbars and data storages by Ctrl-clicking on their names.

## Finding References

You can find all the references of entities, tags, teams, bossbars and data storages by pressing Alt F12.

## Renaming

You can rename entities, tags, teams, bossbars and data storages by pressing F2 or other configured key on their names.

All the references of the same symbol in the whole workspace will be renamed.

**Warning**: your input can be accidentally corrupted by using this feature. Use it at your own risk.

## Signature Help

You can get hints about next arguments while typing.

![signature-help]()

## Formatting (aka Linting)

Your command will be formatted after you commit `\n` character. Alternatively, you can trigger it manually by pressing Alt + Shift + F or other configured hotkey.

There are several linting rules you can set in the configuration file.

**Warning**: your input can be accidentally losed by using this feature. Use it at your own risk. This feature is disabled by default.

### blockStateAppendSpaceAfterComma: `boolean`

Whether to append spaces after commas in block states or not.  
@default `false`

### blockStatePutSpacesAroundEqualSign: `boolean`

Whether to put spaces around equal signs in block states or not.  
@default `false`

### blockStateSortKeys: `boolean`

Whether to sort the keys in block states or not.  
@default `false`

### entitySelectorAppendSpaceAfterComma: `boolean`

Whether to append spaces after commas in entity selectors or not.  
@default `false`

### entitySelectorPutSpacesAroundEqualSign: `boolean`

Whether to put spaces around equal signs in entity selectors or not.  
@default `false`

### entitySelectorKeyOrder: `(keyof SelectorParsedArgument)[]`

In which order the arguments in entity selectors should be. The default order is based on the research
by vdvman1 at https://minecraftcommands.github.io/commanders-handbook/selector-argument-order.  
@default
```json
[
    "sort",
    "limit",
    "type",
    "gamemode",
    "gamemodeNeg",
    "level",
    "team",
    "teamNeg",
    "typeNeg",
    "tag",
    "tagNeg",
    "name",
    "nameNeg",
    "predicate",
    "predicateNeg",
    "scores",
    "advancements",
    "nbt",
    "nbtNeg",
    "x",
    "y",
    "z",
    "dx",
    "dy",
    "dz",
    "distance",
    "x_rotation",
    "y_rotation"
]
```

### quoteType: `'always single' | 'always double' | 'prefer single' | 'prefer double'`

Quotes used in NBT strings and phrase strings.  
`'always single'`: Always use single quotes.  
`'always double'`: Always use double quotes.  
`'prefer single'`: Always use single quotes, unless there are single quotes in the string.  
`'prefer double'`: Always use double quotes, unless there are double quotes in the string.  
@default `'prefer double'`  

### quoteEntitySelectorStrings: `boolean`

When the strings in entity selectors should be quoted.  
`true`: Always.  
`false`: Only when there are special characters in the string.  
@default `false`

### quoteSnbtStringKeys: `boolean`

When the string keys in SNBTs should be quoted.  
`true`: Always.  
`false`: Only when there are special characters in the string.  
@default `false`

### quoteNbtStringValues: `boolean`

When the string values in SNBTs should be quoted.  
`true`: Always.  
`false`: Only when there are special characters in the string.  
@default `true`

### snbtAppendSpaceAfterColon: `boolean`

Whether to append spaces after colons in SNBTs or not.  
@default `true`

### snbtAppendSpaceAfterComma: `boolean`

Whether to append spaces after commas in SNBT or not.  
@default `true`

### snbtAppendSpaceAfterSemicolon: `boolean`

Whether to append spaces after semicolons in SNBTs or not.  
@default `true`

### snbtByteSuffix: `'b' | 'B'`

The suffix used for TAG_Byte in SNBTs.  
@default `'b'`

### snbtUseBooleans: `boolean`

Whether `0b` and `1b` should be represents by `false` and `true` in SNBTs or not.  
@default `false`

### snbtShortSuffix: `'s' | 'S'`

The suffix used for TAG_Short in SNBTs.  
@default `'s'`

### snbtLongSuffix: `'l' | 'L'`

The suffix used for TAG_Long in SNBTs.  
@default `'L'`

### snbtFloatSuffix: `'f' | 'F'`

The suffix used for TAG_Float in SNBTs.  
@default `'f'`

### snbtDoubleSuffix: `'d' | 'D'`

The suffix used for TAG_Double in SNBTs.  
@default `'d'`

### snbtOmitDoubleSuffix: `boolean`

Whether to omit the suffix of double numbers when possible in SNBTs or not.  
@default `false`

### snbtKeepDecimalPlace: `boolean`

Whether to keep at least one decimal place in SNBTs or not.  
@default `true`

### snbtSortKeys: `boolean`

Whether to sort keys in compound tags in SNBTs or not.  
@default `false`

### timeOmitTickUnit: boolean

Whether to omit the unit of tick (`t`) in time arguments.  
@default `false`

### nameOfObjectives: `NamingConventionConfig`

The naming convension for scoreboard objectives.  
@default `'whatever'`

### nameOfSnbtCompoundTagKeys: `NamingConventionConfig`

The naming convension for compound tag keys in SNBTs.  
@default `['PascalCase', 'camelCase']`

### nameOfTags: `NamingConventionConfig`

The naming convension for scoreboard tags.  
@default `'whatever'`

### nameOfTeams: `NamingConventionConfig`

The naming convension for teams.  
@default `'whatever'`

<!-- ### strictBossbarCheck: boolean

Whether to throw warnings for undefined bossbars.  
@default `false` -->

### strictObjectiveCheck: boolean

Whether to throw warnings for undefined objectives.  
@default `false`

### strictTagCheck: boolean

Whether to throw warnings for undefined tags.  
@default `false`

### strictTeamCheck: boolean

Whether to throw warnings for undefined teams.  
@default `false`

### omitDefaultNamespace: boolean

Whether to omit default namespace (`minecraft`) in namespaced IDs.  
Does NOT affect namespaced IDs in NBT strings.  
@default `false`

<!-- ### vectorKeepDecimalPlace: boolean

Whether to keep at least one decimal place in vectors or not.  
If sets to `false`, the decimal place will still be kept to avoid center-correcting when necessary.  
@default `true` -->

# Contributing

Contributions are welcome!

# Sponsers

- 夏白千层心
- 爱发电用户_4vCR
- uuu2011
- Ganxiaozhe
