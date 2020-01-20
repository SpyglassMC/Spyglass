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

| Name | Version | Downloads |
| - | - | - |
| [DHP (JSON)](https://github.com/SPGoding/datapack-json) | [![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-json.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-json) | [![VSCode Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/SPGoding.datapack-json.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-json) |
| [DHP (MCF)](https://github.com/SPGoding/datapack-language-server) | [![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server) | [![VSCode Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server) |

# Installation

You can install DHP (MCF) from the VSCode Marketplace: [![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)

Alternatively, press Ctrl + P and execute `ext install spgoding.datapack-language-server` in your VSCode.

# Workspace Support

Please use the root folder of your datapack (where the `data` folder and the `pack.mcmeta` file are) as a root folder of your workspace, so that DHP can provide you with the best functionalities.

Moreover, DHP fully supports VSCode's [multi-root workspace feature](https://code.visualstudio.com/docs/editor/multi-root-workspaces).

# Features

## Semantic Highlighting

Nope. I follow the spirit of [no code](https://github.com/kelseyhightower/nocode) project so I wrote no code about semantic coloring. There won't be any issues about it, yah!

Just joking. Semantic highlighting will be implemented whenever https://github.com/microsoft/vscode-languageserver-node/pull/367 is resolved. Before that, I recommend to use [Arcensoth](https://github.com/Arcensoth)'s [language-mcfunction](https://marketplace.visualstudio.com/items?itemName=arcensoth.language-mcfunction) extension. All the screenshots below are taken with both mine and Arcensoth's extension enabled.

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

FOR NBTS IN COMMANDS IN JSON TEXT COMPONENTS IN ITEM TAG NBTS, HANDLING THE ANOYYING ESCAPE AUTOMATICALLY FOR YOU:
![ohhhh-completions](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/ohhhh-completions.gif)

## Code Snippets

DHP provides some helpful code snippets. See [VSCode's official docs](https://code.visualstudio.com/docs/editor/userdefinedsnippets) to learn more about code snippets. Both DHP and VSCode allow you to custom your code snippets, and they use exactly the same syntax because DHP is based on VSCode. For mcfunction files, code snippets added by DHP will be shown in the completions list only when the cursor is at the beginning of a command, however snippets added by VSCode's `Code/User/snippets/mcfunction.json` file will be shown everywhere in the file. If you want to custom your code snippets via VSCode, see [their official docs](https://code.visualstudio.com/docs/editor/userdefinedsnippets). If you want to custom snippets via DHP, see the [Configuration Settings section](#Configuration%20Settings).

![code-snippets](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/code-snippets.gif)

## Definition Comments

You can use `#define (bossbar|entity|objective|storage|tag|team) <id: string> [description: string]` to define a bossbar, an entity, an objective, a data storage, an entity tag, or a team. Definition comments will be used to compute completions, rename symbols and find references/definitions. The game will treat definition comments as normal comments and simply ignore them.

![definition-comments](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/definition-comments.png)

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

**WARNING**: your input can be accidentally corrupted by using this feature. Use it at your own risk.

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

# Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/SPGoding"><img src="https://avatars3.githubusercontent.com/u/15277496?v=4" width="100px;" alt=""/><br /><sub><b>SPGoding</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/commits?author=SPGoding" title="Code">💻</a> <a href="https://github.com/SPGoding/datapack-language-server/commits?author=SPGoding" title="Tests">⚠️</a> <a href="https://github.com/SPGoding/datapack-language-server/commits?author=SPGoding" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/MrYurihi"><img src="https://avatars3.githubusercontent.com/u/17830663?v=4" width="100px;" alt=""/><br /><sub><b>MrYurihi</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/commits?author=MrYurihi" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Levertion"><img src="https://avatars1.githubusercontent.com/u/26185209?v=4" width="100px;" alt=""/><br /><sub><b>Levertion</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/commits?author=Levertion" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Bassab03"><img src="https://avatars3.githubusercontent.com/u/21043977?v=4" width="100px;" alt=""/><br /><sub><b>Bassab03</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/commits?author=Bassab03" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/BlackNight0315"><img src="https://avatars3.githubusercontent.com/u/4495596?v=4" width="100px;" alt=""/><br /><sub><b>BlackNight0315</b></sub></a><br /><a href="#design-BlackNight0315" title="Design">🎨</a></td>
    <td align="center"><a href="https://github.com/MarsCloud"><img src="https://avatars2.githubusercontent.com/u/43104628?v=4" width="100px;" alt=""/><br /><sub><b>MarsCloud</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/commits?author=MarsCloud" title="Code">💻</a> <a href="#financial-MarsCloud" title="Financial">💵</a> <a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AMarsCloud" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/switefaster"><img src="https://avatars2.githubusercontent.com/u/19944539?v=4" width="100px;" alt=""/><br /><sub><b>switefaster</b></sub></a><br /><a href="#financial-switefaster" title="Financial">💵</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/PutEgg"><img src="https://avatars2.githubusercontent.com/u/15832518?v=4" width="100px;" alt=""/><br /><sub><b>Heyu</b></sub></a><br /><a href="#financial-PutEgg" title="Financial">💵</a></td>
    <td align="center"><a href="https://github.com/RicoloveFeng"><img src="https://avatars1.githubusercontent.com/u/44725122?v=4" width="100px;" alt=""/><br /><sub><b>RicoloveFeng</b></sub></a><br /><a href="#financial-RicoloveFeng" title="Financial">💵</a></td>
    <td align="center"><a href="https://github.com/pca006132"><img src="https://avatars3.githubusercontent.com/u/12198657?v=4" width="100px;" alt=""/><br /><sub><b>pca006132</b></sub></a><br /><a href="#ideas-pca006132" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://arcensoth.github.io"><img src="https://avatars3.githubusercontent.com/u/1885643?v=4" width="100px;" alt=""/><br /><sub><b>Arcensoth</b></sub></a><br /><a href="#ideas-Arcensoth" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/fedpol1"><img src="https://avatars3.githubusercontent.com/u/54010140?v=4" width="100px;" alt=""/><br /><sub><b>fedpol1</b></sub></a><br /><a href="#ideas-fedpol1" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/ruhuasiyu"><img src="https://avatars2.githubusercontent.com/u/31852729?v=4" width="100px;" alt=""/><br /><sub><b>ruhuasiyu</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3Aruhuasiyu" title="Bug reports">🐛</a> <a href="#ideas-ruhuasiyu" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/mathaym25"><img src="https://avatars0.githubusercontent.com/u/35702771?v=4" width="100px;" alt=""/><br /><sub><b>mathaym25</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3Amathaym25" title="Bug reports">🐛</a> <a href="#ideas-mathaym25" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://mulverinex.github.io/home"><img src="https://avatars2.githubusercontent.com/u/12068027?v=4" width="100px;" alt=""/><br /><sub><b>MulverineX</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AMulverineX" title="Bug reports">🐛</a> <a href="#ideas-MulverineX" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/YijunYuan"><img src="https://avatars0.githubusercontent.com/u/7012463?v=4" width="100px;" alt=""/><br /><sub><b>Yijun Yuan</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AYijunYuan" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/MinecraftPeace"><img src="https://avatars2.githubusercontent.com/u/57551211?v=4" width="100px;" alt=""/><br /><sub><b>MinecraftPeace</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AMinecraftPeace" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/K-bai"><img src="https://avatars2.githubusercontent.com/u/31344344?v=4" width="100px;" alt=""/><br /><sub><b>K-bai</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AK-bai" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/ChenCMD"><img src="https://avatars2.githubusercontent.com/u/46134240?v=4" width="100px;" alt=""/><br /><sub><b>??</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AChenCMD" title="Bug reports">🐛</a> <a href="#ideas-ChenCMD" title="Ideas, Planning, & Feedback">🤔</a> <a href="#translation-ChenCMD" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/TouchFisha"><img src="https://avatars0.githubusercontent.com/u/48653079?v=4" width="100px;" alt=""/><br /><sub><b>TouchFisha</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3ATouchFisha" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/yulongjiuqiu"><img src="https://avatars1.githubusercontent.com/u/49058621?v=4" width="100px;" alt=""/><br /><sub><b>御龙九秋</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3Ayulongjiuqiu" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/RevonZev"><img src="https://avatars2.githubusercontent.com/u/39231292?v=4" width="100px;" alt=""/><br /><sub><b>RevonZev</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3ARevonZev" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/OctupusTea"><img src="https://avatars0.githubusercontent.com/u/22555936?v=4" width="100px;" alt=""/><br /><sub><b>OctupusTea</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AOctupusTea" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/00ll00"><img src="https://avatars0.githubusercontent.com/u/40747228?v=4" width="100px;" alt=""/><br /><sub><b>00ll00</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3A00ll00" title="Bug reports">🐛</a></td>
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
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=1073895"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=1073895&size=middle" width="100px;" alt="uuu2011"/><br /><sub><b>uuu2011</b></sub></a><br /><a href="#financial-uuu2011" title="Financial">💵</a></td>
    <td align="center"><a href="https://afdian.net/u/64da395e2b6811e99c7652540025c377"><img src="https://pic.afdiancdn.com/default/avatar/default-avatar@2x.png" width="100px;" alt="爱发电用户_4vCR"/><br /><sub><b>爱发电用户_4vCR</b></sub></a><br /><a href="#financial-爱发电用户_4vCR" title="Financial">💵</a></td>
    <td align="center"><a href="https://afdian.net/u/9c5521849fb011e99ecc52540025c377"><img src="https://pic.afdiancdn.com/user/9c5521849fb011e99ecc52540025c377/avatar/5d5ebfa0c83f7a50304bb472c9d320c1_w640_h640_s69.jpg" width="100px;" alt="夏白千层心"/><br /><sub><b>夏白千层心</b></sub></a><br /><a href="#financial-夏白千层心" title="Financial">💵</a></td>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=2176760"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=2176760&size=middle" width="100px;" alt="MCSugar_cane"/><br /><sub><b>MCSugar_cane</b></sub></a><br /><a href="#financial-MCSugar_cane" title="Financial">💵</a></td>
    <td align="center"><a href="https://afdian.net/@ChongXG"><img src="https://pic.afdiancdn.com/user/80487c58bfa911e8856452540025c377/avatar/c71ebb2c5c792b45d6f5b5bf087b0625_w1536_h1536_s1404.jpg" width="100px;" alt="虫小哥"/><br /><sub><b>虫小哥</b></sub></a><br /><a href="#financial-虫小哥" title="Financial">💵</a></td>
    <td align="center"><a href="https://afdian.net/@dhwpcs"><img src="https://pic.afdiancdn.com/user/470992469a5c11e881aa52540025c377/avatar/407310e7b07629c97d42949e4522f1c8_w395_h395_s71.jpg" width="100px;" alt="Craft_Kevin"/><br /><sub><b>Craft_Kevin</b></sub></a><br /><a href="#financial-Craft_Kevin" title="Financial">💵</a></td>
    <td align="center"><a href="https://afdian.net/u/c0ff1996ab5911e8ac0152540025c377"><img src="https://pic.afdiancdn.com/user/c0ff1996ab5911e8ac0152540025c377/avatar/8743119a6dbbfeb3b986472835a7accb_w413_h456_s155.jpg" width="100px;" alt="陌余Oucher"/><br /><sub><b>陌余Oucher</b></sub></a><br /><a href="#financial-陌余Oucher" title="Financial">💵</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=145106"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=145106&size=middle" width="100px;" alt="龙腾猫跃"/><br /><sub><b>龙腾猫跃</b></sub></a><br /><a href="#financial-龙腾猫跃" title="Financial">💵</a></td>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=641356"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=641356&size=middle" width="100px;" alt="雪颜の顾"/><br /><sub><b>雪颜の顾</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3A雪颜の顾" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=702915"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=702915&size=middle" width="100px;" alt="Jokey_钥匙"/><br /><sub><b>Jokey_钥匙</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AJokey_钥匙" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=2944670"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=2944670&size=large" width="100px;" alt="MineCommander"/><br /><sub><b>MineCommander</b></sub></a><br /><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AMineCommander" title="Bug reports">🐛</a></td>
  </tr>
</table>
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

# Repository Structure

- `dist`: Bundled files. These files are included in both the NPM package and the VSCode extension.
- `lib`: TypeScript Declaration (`.d.ts`) files. These files are only included in the NPM package.
- `src`: TypeScript source code.

# References

- [https://github.com/microsoft/vscode-extension-samples/blob/master/lsp-multi-server-sample/client/src/extension.ts](Multi Language Server Example)
