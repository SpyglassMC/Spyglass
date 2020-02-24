![banner](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/banner.png)

[![Discord](https://img.shields.io/discord/666020457568403505?logo=discord&style=flat-square)](https://discord.gg/EbdseuS)
[![CircleCI](https://img.shields.io/circleci/build/github/SPGoding/datapack-language-server.svg?logo=circleci&style=flat-square)](https://circleci.com/gh/SPGoding/datapack-language-server)
[![npm](https://img.shields.io/npm/v/datapack-language-server.svg?logo=npm&style=flat-square)](https://npmjs.com/package/datapack-language-server)
[![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![VSCode Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![VSCode Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![VSCode Marketplace Rating](https://img.shields.io/visual-studio-marketplace/stars/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![Codecov](https://img.shields.io/codecov/c/gh/SPGoding/datapack-language-server.svg?logo=codecov&style=flat-square)](https://codecov.io/gh/SPGoding/datapack-language-server)
[![License](https://img.shields.io/github/license/SPGoding/datapack-language-server.svg?style=flat-square)](https://github.com/SPGoding/datapack-language-server/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.carloscuesta.me/)

Datapack Helper Plus is the spiritual successor of [pca006132](https://github.com/pca006132)'s [datapack helper](https://github.com/pca006132/datapack-helper) which is only updated to _Minecraft_: Java Edition 1.13. There are no actual connections between them.

DHP is splitted into two parts: [the JSON part](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-json) and [the MCF part](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server). While the former provides supports for all JSON files in a datapack (like advancements, recipes, predicates, loot tables, and tags), the latter provides supports for mcfunction files. The introduction you are reading right now is for the MCF part.

| Name                                                              | Version                                                                                                                                                                                                                                            | Downloads                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [DHP (JSON)](https://github.com/SPGoding/datapack-json)           | [![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-json.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-json)                       | [![VSCode Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/SPGoding.datapack-json.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-json)                       |
| [DHP (MCF)](https://github.com/SPGoding/datapack-language-server) | [![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server) | [![VSCode Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server) |

- [Installation](#installation)
- [Features](#features)
  - [Workspace Support](#workspace-support)
  - [Multiple Language Support](#multiple-language-support)
  - [Semantic Highlighting](#semantic-highlighting)
  - [Signature Information](#signature-information)
  - [Completions](#completions)
  - [Code Snippets](#code-snippets)
  - [Definition Comments](#definition-comments)
  - [Diagnostics](#diagnostics)
  - [Folding Ranges](#folding-ranges)
  - [Call Hierarchy](#call-hierarchy)
  - [Color Information](#color-information)
  - [Hover Information](#hover-information)
  - [Resolving Namespaced IDs](#resolving-namespaced-ids)
  - [Goto Definitions](#goto-definitions)
  - [Finding References](#finding-references)
  - [Renaming](#renaming)
  - [Formatting and Linting](#formatting-and-linting)
  - [Configuration Settings](#configuration-settings)
  - [Regenerating Cache](#regenerating-cache)
- [Contributors](#contributors)
  - [dependency-npm_modules](#dependency-npmmodules)
  - [dependency-Arcensoth](#dependency-arcensoth)
  - [dependency-Yurihaia](#dependency-yurihaia)
  - [dependency-Misode](#dependency-misode)
  - [design-BlackNight0315](#design-blacknight0315)
  - [localization-Feierwoerx](#localization-feierwoerx)
  - [localization-TCasseBloc](#localization-tcassebloc)
  - [localization-Ghoulboy78](#localization-ghoulboy78)
  - [localization-ChenCMD](#localization-chencmd)
  - [localization-SPGoding](#localization-spgoding)
  - [sponsor](#sponsor)
- [Repository Structure](#repository-structure)

# Installation

You can install DHP (MCF) from the VSCode Marketplace: [![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)

Alternatively, press Ctrl + P and execute `ext install spgoding.datapack-language-server` in your VSCode.

# Features

## Workspace Support

Please use the root folder of your datapack (where the `data` folder and the `pack.mcmeta` file are) as a root folder of your workspace, so that DHP can provide you with the best functionalities.

Moreover, DHP fully supports VSCode's [multi-root workspace feature](https://code.visualstudio.com/docs/editor/multi-root-workspaces). Every root which contains a `data` folder and `pack.mcmeta` file will be considered as a datapack and will be used for computing completions. Other root folders will not be affected by DHP.

You can access any content of any root as long as they are in the same workspace. The order of the roots in your workspace will affect the priority of these datapacks in DHP. The root at the beginning will be loaded at first, and the root at the end will be loaded at last, which means that the **earlier** the root is, the **lower** priority in DHP it has. This is exactly how Minecraft loads datapacks and decide which one overrides another one if a file has the same namespaced ID and is in the same category. For example, if your multi-root workspace looks like this:

```
─── (Root) Datapack A
   ├── data
   |   └── spgoding
   |       └── functions
   |           └── foo.mcfunction
   └── pack.mcmeta
─── (Root) Datapack B
   ├── data
   |   └── spgoding
   |       └── functions
   |           └── foo.mcfunction
   └── pack.mcmeta
```

And then you use `F2` in a mcfunction file to renamed the mcfunction `spgoding:foo` to `wtf:foo`, only the file in Datapack B (`Datapack B/data/spgoding/functions/foo.mcfunction`) will be moved to `Datapack B/data/wtf/functions/foo.mcfunction`, even if there's a function with the same namespaced ID in Datapack A (`Datapack A/data/spgoding/functions/foo.mcfunction`).

If you try to execute these commands in Minecraft, you can also noticed that the function in Datapack B is executed.
```mcfunction
datapack enable "file/Datapack A" first
datapack enable "file/Datapack B" last
function spgoding:foo
```

By acting like this, DHP ensures that the order it handling datapacks is consistent with Minecraft.

**Note**: you can drag and put the root folders in VSCode to sort them, and DHP will update the priority of them in DHP accordingly, which is really handy.

## Multiple Language Support

DHP supports multiple languages. Currently these languages are available:

| Language             | VSCode Language ID |
| -------------------- | ------------------ |
| German               | `de`               |
| English              | `en`               |
| French               | `fr`               |
| Italian              | `it`               |
| Japanese             | `ja`               |
| Chinese (Simplified) | `zh-cn`            |

If you'd like to help us translate this project into other languages, it would be really appreciated! See [CONTRIBUTING.md](https://github.com/SPGoding/datapack-language-server/blob/master/CONTRIBUTING.md) for more information!

## Semantic Highlighting

All command arguments should be colored semantically. You can see [#308](https://github.com/SPGoding/datapack-language-server/issues/308) for a detailed list of all semantic token types and modifiers used by DHP if you are interested in.

Unfortunately, the semantic coloring API of VSCode is still in proposed stage, thus we cannot use it in production environment. All the screenshots below are taken in development mode.

Before VSCode finalizes its API, I recommend to use [Arcensoth](https://github.com/Arcensoth)'s [language-mcfunction](https://marketplace.visualstudio.com/items?itemName=arcensoth.language-mcfunction) extension for coloring. 

## Signature Information

You can get hints about the arguments of commands while typing.

![signature-help](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/signature-help.gif)

## Completions

The extension can compute completions as you typing commands. Completions will automatically show if you commit one of these characters: `[' ', ',', '{', '[', '=', ':', '/', '!', "'", '"', '.', '@']`. Alternatively you can use Ctrl + Space (or other configured hotkey) to show completions manually. Note: completions are not available everywhere. Typically only the beginnings of arguments and literals are supported.

DHP can provide completions for simple commands:
![simple-completions](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/simple-completions.gif)

For more complex NBT tags, with the help from [mc-nbt-paths](https://github.com/MrYurihi/mc-nbt-paths) contributed by MrYurihi, Levertion and Bassab03:
![nbt-tag-completions](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/nbt-tag-completions.gif)

And also NBT paths:
![nbt-path-completions](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/nbt-path-completions.gif)

## Code Snippets

DHP provides some helpful code snippets. See [VSCode's official docs](https://code.visualstudio.com/docs/editor/userdefinedsnippets) to learn more about code snippets. Both DHP and VSCode allow you to custom your code snippets, and they use exactly the same syntax because DHP is based on VSCode. For mcfunction files, code snippets added by DHP will be shown in the completions list only when the cursor is at the beginning of a command, however snippets added by VSCode's `Code/User/snippets/mcfunction.json` file will be shown everywhere in the file. If you want to custom your code snippets via VSCode, see [their official docs](https://code.visualstudio.com/docs/editor/userdefinedsnippets). If you want to custom snippets via DHP, see the [Configuration Settings section](#Configuration%20Settings).

![code-snippets](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/code-snippets.gif)

## Definition Comments

You can use `#define (bossbar|entity|objective|storage|tag|team) <id: string> [<description: string>]` to define a bossbar, an entity, an objective, a data storage, an entity tag, or a team. Definition comments will be used to compute completions, rename symbols and find references/definitions by DHP. The game will treat definition comments as normal comments and simply ignore them.

![definition-comments](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/definition-comments.png)

## Diagnostics

DHP provides real-time diagnostics about your commands. It can show syntax errors as Minecraft does, and even give your more detailed warnings.

![diagnostics](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/diagnostics.gif)

## Folding Ranges

You can use comments (`#region` and `#endregion`) to create folding ranges, which makes the structure of mcfunction file much clearer. 

```mcfunction
#region This is a block of commands
execute if score @s test matches 1 run say 1
execute if score @s test matches 2 run say 2
execute if score @s test matches 3 run say 3
execute if score @s test matches 4 run say 4
execute if score @s test matches 5 run say 5
#endregion
```

Alternatively, you can use different amount of hash symbols followed by at least one white space to create different levels of folding ranges: 

```mcfunction
#region This is a block of commands
# One
## One - 1
execute if score @s foo matches 1 run say 1
execute if score @s foo matches 2 run say 2
## One - 2
execute if score @s bar matches 1 run say 1
execute if score @s bar matches 2 run say 2
# Two
execute if score @p test matches 1 run say 1
#endregion
```

![folding-ranges](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/folding-ranges.gif)

## Call Hierarchy

_This feature is finished by using the proposed API, which is only accessible in development environment._

Call hierarchies are a great way to navigate through functions. You can get all the callers/callees of a function, function tag, or an advancement reward by using this feature. The default hotkey of this feature is `Shift + Alt + H`.

![call-hierarchy](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/call-hierarchy.gif)

## Color Information

DHP will display colors for `dust` particles and `color` tags in NBTs. You can change the color by hovering your cursor on it.

![color-information](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/color-information.gif)

## Hover Information

This is WIP.

DHP shows user-defined documentation when you hover on specific arguments, e.g. on function namespaced IDs, tags, teams, etc.

<!-- ![hover-on-function]() -->

## Resolving Namespaced IDs

You can navigate to advancements, loot tables, functions, predicates, and all kinds of tags by Ctrl-clicking on their namespaced IDs.

![document-link](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/document-link.gif)

## Goto Definitions

You can goto the definitions of objectives, entities, tags, teams, bossbars, and data storages in the workspace by Ctrl-clicking on their names.

![goto-definition](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/goto-definition.gif)

## Finding References

You can find all the references of objectives, entities, tags, teams, bossbars, data storages, advancements, functions, loot tables, predicates, recipes, and all kinds of datapack tags in the workspace by pressing Shift + F12 or other configured key.

![peek-references](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/peek-references.gif)

## Renaming

You can rename entities, tags, teams, bossbars, data storages, advancements, functions, loot tables, predicates, recipes, and all kinds of datapack tags by pressing F2 or other configured key on their names.

All the references of the same symbol in the whole workspace will be renamed.

**WARNING**: your input can be accidentally corrupted by using this feature. Use it at your own risk. You can use the Rename Preview operation provided by VSCode to make sure that nothing is broken before actually renaming.

![rename-objective](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/rename-objective.gif)

Additionally, if you rename a namespaced ID with file definition (e.g. the ID for advancement, function, loot table, predicate, recipe or tag), the corresponding file in the workspace will be renamed/moved too.

![rename-function](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/rename-function.gif)

*However*, renaming a file in a workspace manually will *not* update the namespaced IDs of it, and may cause problems with the cache.

## Formatting and Linting

You can format the current function by pressing Shift + Alt + F or other configured hotkey.

There are several linting rules you can set in the configuration settings.

**WARNING**: your input can be accidentally lost by using this feature. Use it at your own risk. This feature is disabled by default. You can enable this feature by changing the `datapackLanguageServer.lint.enableFormatting` setting.

![formatting](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/formatting.gif)

## Configuration Settings

Press Ctrl + `,` (or other configured hotkey) to open the Settings page of VSCode, and search `datapackLanguageServer` to see all the configuration settings contributed by DHP. You can add your own code snippets, set the lint preferences and environment information to meet your needs. These config can be changed for the current user or the workspace. See [VSCode's official docs](https://code.visualstudio.com/docs/getstarted/settings) to learn more about configuring settings.

## Regenerating Cache

DHP uses cache to accelerate the process of renaming, finding references/definitions, document links, etc. However, the cache may become outdated because of various reasons, which could lead to strange behaviors. You can use the `Datapack: Regenerate Cache` command (ID: `datapackLanguageServer.regenerateCache`) to regenerate the cache manually.

# Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/SPGoding"><img src="https://avatars3.githubusercontent.com/u/15277496?v=4" width="100px;" alt=""/><br /><sub><b>SPGoding</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/commits?author=SPGoding" title="Code">💻</a> <a href="#localization-SPGoding" title="Localization">🌍</a></td>
    <td align="center"><a href="https://github.com/Yurihaia"><img src="https://avatars3.githubusercontent.com/u/17830663?v=4" width="100px;" alt=""/><br /><sub><b>Yurihaia</b></sub></a><br /><a href="#dependency-Yurihaia" title="Dependencies other than NPM modules">⬆️</a> <a href="#" title="Ideas, Planning, and Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/BlackNight0315"><img src="https://avatars3.githubusercontent.com/u/4495596?v=4" width="100px;" alt=""/><br /><sub><b>BlackNight0315</b></sub></a><br /><a href="#design-BlackNight0315" title="Design">🎨</a></td>
    <td align="center"><a href="https://github.com/MarsCloud"><img src="https://avatars2.githubusercontent.com/u/43104628?v=4" width="100px;" alt=""/><br /><sub><b>MarsCloud</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/commits?author=MarsCloud" title="Code">💻</a> <a href="#sponsor" title="Sponsor">💝</a> <a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AMarsCloud" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/switefaster"><img src="https://avatars2.githubusercontent.com/u/19944539?v=4" width="100px;" alt=""/><br /><sub><b>switefaster</b></sub></a><br /><a href="#sponsor" title="Sponsor">💝</a></td>
    <td align="center"><a href="https://github.com/PutEgg"><img src="https://avatars2.githubusercontent.com/u/15832518?v=4" width="100px;" alt=""/><br /><sub><b>Heyu</b></sub></a><br /><a href="#sponsor" title="Sponsor">💝</a></td>
    <td align="center"><a href="https://github.com/RicoloveFeng"><img src="https://avatars1.githubusercontent.com/u/44725122?v=4" width="100px;" alt=""/><br /><sub><b>RicoloveFeng</b></sub></a><br /><a href="#sponsor" title="Sponsor">💝</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=1073895"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=1073895&size=middle" width="100px;" alt=""/><br /><sub><b>uuu2011</b></sub></a><br /><a href="#sponsor" title="Sponsor">💝</a></td>
    <td align="center"><a href="https://afdian.net/u/64da395e2b6811e99c7652540025c377"><img src="https://pic.afdiancdn.com/default/avatar/default-avatar@2x.png" width="100px;" alt=""/><br /><sub><b>爱发电用户_4vCR</b></sub></a><br /><a href="#sponsor" title="Sponsor">💝</a></td>
    <td align="center"><a href="https://afdian.net/u/9c5521849fb011e99ecc52540025c377"><img src="https://pic.afdiancdn.com/user/9c5521849fb011e99ecc52540025c377/avatar/5d5ebfa0c83f7a50304bb472c9d320c1_w640_h640_s69.jpg" width="100px;" alt=""/><br /><sub><b>夏白千层心</b></sub></a><br /><a href="#sponsor" title="Sponsor">💝</a></td>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=2176760"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=2176760&size=middle" width="100px;" alt=""/><br /><sub><b>MCSugar_cane</b></sub></a><br /><a href="#sponsor" title="Sponsor">💝</a></td>
    <td align="center"><a href="https://afdian.net/@ChongXG"><img src="https://pic.afdiancdn.com/user/80487c58bfa911e8856452540025c377/avatar/c71ebb2c5c792b45d6f5b5bf087b0625_w1536_h1536_s1404.jpg" width="100px;" alt=""/><br /><sub><b>虫小哥</b></sub></a><br /><a href="#sponsor" title="Sponsor">💝</a></td>
    <td align="center"><a href="https://afdian.net/@dhwpcs"><img src="https://pic.afdiancdn.com/user/470992469a5c11e881aa52540025c377/avatar/407310e7b07629c97d42949e4522f1c8_w395_h395_s71.jpg" width="100px;" alt=""/><br /><sub><b>Craft_Kevin</b></sub></a><br /><a href="#sponsor" title="Sponsor">💝</a></td>
    <td align="center"><a href="https://afdian.net/u/c0ff1996ab5911e8ac0152540025c377"><img src="https://pic.afdiancdn.com/user/c0ff1996ab5911e8ac0152540025c377/avatar/8743119a6dbbfeb3b986472835a7accb_w413_h456_s155.jpg" width="100px;" alt=""/><br /><sub><b>陌余Oucher</b></sub></a><br /><a href="#sponsor" title="Sponsor">💝</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=145106"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=145106&size=middle" width="100px;" alt=""/><br /><sub><b>龙腾猫跃</b></sub></a><br /><a href="#sponsor" title="Sponsor">💝</a></td>
    <td align="center"><a href="https://github.com/pca006132"><img src="https://avatars3.githubusercontent.com/u/12198657?v=4" width="100px;" alt=""/><br /><sub><b>pca006132</b></sub></a><br /><a href="#" title="Ideas, Planning, and Feedback">🤔</a></td>
    <td align="center"><a href="https://arcensoth.github.io"><img src="https://avatars3.githubusercontent.com/u/1885643?v=4" width="100px;" alt=""/><br /><sub><b>Arcensoth</b></sub></a><br /><a href="#dependency-Arcensoth" title="Dependencies other than NPM modules">⬆️</a> <a href="#" title="Ideas, Planning, and Feedback">🤔</a> <a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AArcensoth" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/fedpol1"><img src="https://avatars3.githubusercontent.com/u/54010140?v=4" width="100px;" alt=""/><br /><sub><b>fedpol1</b></sub></a><br /><a href="#" title="Ideas, Planning, and Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/ruhuasiyu"><img src="https://avatars2.githubusercontent.com/u/31852729?v=4" width="100px;" alt=""/><br /><sub><b>ruhuasiyu</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3Aruhuasiyu" title="Bug reports">🐛</a> <a href="#" title="Ideas, Planning, and Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/mathaym25"><img src="https://avatars0.githubusercontent.com/u/35702771?v=4" width="100px;" alt=""/><br /><sub><b>mathaym25</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3Amathaym25" title="Bug reports">🐛</a> <a href="#" title="Ideas, Planning, and Feedback">🤔</a></td>
    <td align="center"><a href="http://mulverinex.github.io/home"><img src="https://avatars2.githubusercontent.com/u/12068027?v=4" width="100px;" alt=""/><br /><sub><b>MulverineX</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AMulverineX" title="Bug reports">🐛</a> <a href="#" title="Ideas, Planning, and Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/YijunYuan"><img src="https://avatars0.githubusercontent.com/u/7012463?v=4" width="100px;" alt=""/><br /><sub><b>Yijun Yuan</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AYijunYuan" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/MinecraftPeace"><img src="https://avatars2.githubusercontent.com/u/57551211?v=4" width="100px;" alt=""/><br /><sub><b>MinecraftPeace</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AMinecraftPeace" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/K-bai"><img src="https://avatars2.githubusercontent.com/u/31344344?v=4" width="100px;" alt=""/><br /><sub><b>K-bai</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AK-bai" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/ChenCMD"><img src="https://avatars2.githubusercontent.com/u/46134240?v=4" width="100px;" alt=""/><br /><sub><b>ChenCMD</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AChenCMD" title="Bug reports">🐛</a> <a href="#" title="Ideas, Planning, and Feedback">🤔</a> <a href="#localization-ChenCMD" title="Localization">🌍</a></td>
    <td align="center"><a href="https://github.com/TouchFisha"><img src="https://avatars0.githubusercontent.com/u/48653079?v=4" width="100px;" alt=""/><br /><sub><b>TouchFisha</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3ATouchFisha" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/yulongjiuqiu"><img src="https://avatars1.githubusercontent.com/u/49058621?v=4" width="100px;" alt=""/><br /><sub><b>御龙九秋</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3Ayulongjiuqiu" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/RevonZev"><img src="https://avatars2.githubusercontent.com/u/39231292?v=4" width="100px;" alt=""/><br /><sub><b>RevonZev</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3ARevonZev" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/OctupusTea"><img src="https://avatars0.githubusercontent.com/u/22555936?v=4" width="100px;" alt=""/><br /><sub><b>OctupusTea</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AOctupusTea" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/00ll00"><img src="https://avatars0.githubusercontent.com/u/40747228?v=4" width="100px;" alt=""/><br /><sub><b>00ll00</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3A00ll00" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=641356"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=641356&size=middle" width="100px;" alt=""/><br /><sub><b>雪颜の顾</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3A雪颜の顾" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=702915"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=702915&size=middle" width="100px;" alt=""/><br /><sub><b>Jokey_钥匙</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AJokey_钥匙" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=2944670"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=2944670&size=middle" width="100px;" alt=""/><br /><sub><b>MineCommander</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AMineCommander" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=2337994"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=2337994&size=middle" width="100px;" alt=""/><br /><sub><b>隐退</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3A隐退" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=2612019"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=2612019&size=middle" width="100px;" alt=""/><br /><sub><b>Chelove_C60</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AChelove_C60" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=1253833"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=1253833&size=middle" width="100px;" alt=""/><br /><sub><b>brooke_zb</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3Abrooke_zb" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/dragon3025"><img src="https://avatars3.githubusercontent.com/u/11652210?s=460&v=4" width="100px;" alt=""/><br /><sub><b>dragon3025</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3Adragon3025" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/Misode"><img src="https://avatars0.githubusercontent.com/u/17352009?s=460&v=4" width="100px;" alt=""/><br /><sub><b>Misode</b></sub></a><br /><a href="#dependency-Misode" title="Dependencies other than NPM modules">⬆️</a> <a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AMisode" title="Bug reports">🐛</a></td>
    <td align="center"><img src="https://cdn.discordapp.com/avatars/236162204318040065/2163d83b5f7a30335792349f3eb10d13.png?size=256" width="100px;" alt=""/><br /><sub><b>Feierwoerx</b></sub><br /><a href="#localization-Feierwoerx" title="Localization">🌍</a></td>
    <td align="center"><img src="https://cdn.discordapp.com/avatars/277115101465673729/17caf7ffa677227d81c4dd06ef6974f3.png?size=256" width="100px;" alt=""/><br /><sub><b>TCasseBloc</b></sub><br /><a href="#localization-TCasseBloc" title="Localization">🌍</a></td>
  </tr>
  <tr>
    <td align="center"><img src="https://avatars1.githubusercontent.com/u/53367549?s=460&v=4" width="100px;" alt=""/><br /><sub><b>Ghoulboy</b></sub><br /><a href="#localization-Ghoulboy78" title="Localization">🌍</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

## dependency-npm_modules

The exisistence of DHP comes from many other excellent developers! All NPM module dependencies which are installed via [NPM](https://www.npmjs.com/) can be found in [package.json](https://github.com/SPGoding/datapack-language-server/blob/master/package.json).

## dependency-Arcensoth

Maintains [mcdata](https://github.com/Arcensoth/mcdata), a repository that stores the latest data generated by Minecraft's data generator. DHP downloads data from this repository to provide version-specific completions for blocks and registries. See [#333](https://github.com/SPGoding/datapack-language-server/issues/333) for more details.

## dependency-Yurihaia

Maintains [mc-nbtdoc](https://github.com/Yurihaia/mc-nbtdoc/tree/master), a repository that stores "machine and human readable documentation for all of Minecraft's in game NBT data". DHP downloads genetated JSON files from this repository to provide completions and validations for version-specific NBT data. See [#332](https://github.com/SPGoding/datapack-language-server/issues/332) for more details.

## dependency-Misode

Provides [Tabula](https://github.com/misode/tabula), a lightweight localization tool which is used by DHP to help translate `src/locales/en.json` and `package.nls.json`.

## design-BlackNight0315

Designed the DHP's icon and the banner showed on top of this page.

## localization-Feierwoerx

Localization for 🇩🇪 German (`de`).

## localization-TCasseBloc

Localization for 🇫🇷 French (`fr`).

## localization-Ghoulboy78

Localization for 🇮🇹 Italian (`it`).

## localization-ChenCMD

Localization for 🇯🇵 Japanese (`ja`).

## localization-SPGoding

Localization for 🇨🇳 Simplified Chinese (`zh-cn`).

## sponsor

SPGoding used to receive financial supports, but there are no ways to sponsor spg anymore.

# Repository Structure

- `dist`: Bundled files.
  - `client.js`: Stuff related to the client. Only included in the VSCode extension.
  - `server.js`: Stuff related to the server. Included in both the VSCode extension and the NPM package.
- `lib`: TypeScript Declaration (`.d.ts`) files. These files are only included in the NPM package.
- `src`: TypeScript source code.
