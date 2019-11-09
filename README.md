# datapack-language-server

![banner](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/banner.png)

[![CircleCI](https://img.shields.io/circleci/build/github/SPGoding/datapack-language-server.svg?logo=circleci&style=flat-square)](https://circleci.com/gh/SPGoding/datapack-language-server)
[![npm](https://img.shields.io/npm/v/datapack-language-server.svg?logo=npm&style=flat-square)](https://npmjs.com/package/datapack-language-server)
[![Codecov](https://img.shields.io/codecov/c/gh/SPGoding/datapack-language-server.svg?logo=codecov&style=flat-square)](https://codecov.io/gh/SPGoding/datapack-language-server)
[![License](https://img.shields.io/github/license/SPGoding/datapack-language-server.svg?style=flat-square)](https://github.com/SPGoding/datapack-language-server/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.carloscuesta.me/)

Language server for Minecraft: Java Edition datapacks. THIS IS STILL WIP SO MANY FEATURES DO NOT WORK.

# Features

## Semantic Highlighting

Nope. I follow the spirit of [no code](https://github.com/kelseyhightower/nocode) project so I wrote no code about semantic coloring. There won't be any issues about it, yah!

Just joking. Semantic highlighting will be implemented whenever https://github.com/microsoft/vscode-languageserver-node/pull/367 is resolved. Before that, I recommend to use [Arcensoth](https://github.com/Arcensoth)'s [language-mcfunction](https://marketplace.visualstudio.com/items?itemName=arcensoth.language-mcfunction) extension.

## Signature Information

You can get hints about the arguments of commands while typing.

![signature-help](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/signature-help.gif)
![signature-help-2](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/signature-help-2.gif)

## Completions

The extension can compute completions as you typing commands. Completions will automatically show if you commit one of these characters: `[' ', ',', '{', '[', '=', ':', '/', '@', '!', "'", '"']`. Alternatively you can use Ctrl + Space (or other configured hotkey) to show completions manually. Note: completions are not available everywhere. Typically only the beginnings of arguments and literals are supported.

DHP can provide completions for simple commands:
![simple-completions](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/simple-completions.gif)

**The following completion features are still WIP:**

For more complex NBTs:
<!-- ![nbt]() -->

FOR NBTS IN COMMANDS IN JSON TEXT COMPONENTS IN ITEM TAG NBTS, HANDLING THE ANOYYING ESCAPE AUTOMATICALLY FOR YOU:
<!-- ![ohhhhhh]() -->

## Diagnostics

DHP provides real-time diagnostics about your commands. It can show syntax errors as Minecraft does, and even give your more detailed warnings.

![diagnostics](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/diagnostics.gif)

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

![folding-region](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/folding-region.gif)

## Color Information

DHP will display colors for `dust` particles. You can change the colors by hovering your cursor on them.

![color-particle](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/color-particle.gif)

## Hover Information

This is WIP.

DHP shows user-defined documentation when you hover on specific arguments, e.g. on function namespaced IDs, tags, teams, etc.

<!-- ![hover-on-function]() -->

## Resolving Namespaced IDs

This is WIP.

You can navigate to advancements, loot tables, functions, predicates and all kinds of tags by Ctrl-clicking on their namespaced IDs.

<!-- ![navigate-to-predicate]() -->

## Goto Definitions

This is WIP.

You can goto the definitions of entities, tags, teams, bossbars and data storages by Ctrl-clicking on their names.

## Finding References

This is WIP.

You can find all the references of entities, tags, teams, bossbars and data storages by pressing Alt F12.

## Renaming

This is WIP.

You can rename entities, tags, teams, bossbars and data storages by pressing F2 or other configured key on their names.

All the references of the same symbol in the whole workspace will be renamed.

**Warning**: your input can be accidentally corrupted by using this feature. Use it at your own risk.

## Formatting (aka Linting)

This is WIP.

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

<!-- ### quoteEntitySelectorStrings: `boolean`

When the strings in entity selectors should be quoted.  
`true`: Always.  
`false`: Only when there are special characters in the string.  
@default `false` -->

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
@default `'whatever'`

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

# Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/SPGoding"><img src="https://avatars3.githubusercontent.com/u/15277496?v=4" width="100px;" alt="SPGoding"/><br /><sub><b>SPGoding</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/commits?author=SPGoding" title="Code">💻</a> <a href="https://github.com/SPGoding/datapack-language-server/commits?author=SPGoding" title="Tests">⚠️</a> <a href="https://github.com/SPGoding/datapack-language-server/commits?author=SPGoding" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

And to those who haven't told me a GitHub account:

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=67858"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=67858&size=middle" width="100px;" alt="夜之暗夜"/><br /><sub><b>夜之暗夜</b></sub></a><br /><a href="#design-夜之暗夜" title="Design">🎨</a></td>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=1073895"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=1073895&size=middle" width="100px;" alt="uuu2011"/><br /><sub><b>uuu2011</b></sub></a><br /><a href="#financial-uuu2011" title="Financial">💵</a></td>
    <td align="center"><a href="https://afdian.net/u/64da395e2b6811e99c7652540025c377"><img src="https://pic.afdiancdn.com/default/avatar/default-avatar@2x.png" width="100px;" alt="爱发电用户_4vCR"/><br /><sub><b>爱发电用户_4vCR</b></sub></a><br /><a href="#financial-爱发电用户_4vCR" title="Financial">💵</a></td>
    <td align="center"><a href="https://afdian.net/u/9c5521849fb011e99ecc52540025c377"><img src="https://pic.afdiancdn.com/user/9c5521849fb011e99ecc52540025c377/avatar/5d5ebfa0c83f7a50304bb472c9d320c1_w640_h640_s69.jpg" width="100px;" alt="夏白千层心"/><br /><sub><b>夏白千层心</b></sub></a><br /><a href="#financial-夏白千层心" title="Financial">💵</a></td>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=2176760"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=2176760&size=middle" width="100px;" alt="MCSugar_cane"/><br /><sub><b>MCSugar_cane</b></sub></a><br /><a href="#financial-MCSugar_cane" title="Financial">💵</a></td>
  </tr>
</table>
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
