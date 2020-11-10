![banner](https://raw.githubusercontent.com/SPGoding/vscode-datapack-helper-plus/master/img/banner.png)

[![Discord](https://img.shields.io/discord/666020457568403505?logo=discord&style=flat-square)](https://discord.gg/EbdseuS)
[![GitHub Actions](https://img.shields.io/github/workflow/status/SPGoding/datapack-language-server/Test?logo=github&style=flat-square)](https://github.com/SPGoding/datapack-language-server/actions)
[![npm](https://img.shields.io/npm/v/datapack-language-server.svg?logo=npm&style=flat-square)](https://npmjs.com/package/datapack-language-server)
[![Codecov](https://img.shields.io/codecov/c/gh/SPGoding/datapack-language-server.svg?logo=codecov&style=flat-square)](https://codecov.io/gh/SPGoding/datapack-language-server)
[![License](https://img.shields.io/github/license/SPGoding/datapack-language-server.svg?style=flat-square)](https://github.com/SPGoding/datapack-language-server/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.carloscuesta.me/)

Data-pack Language Server can provide many heavy language features for documents in your datapack, including advancements, dimensions, dimension types, functions, loot tables, predicates, recipes, all kinds of tags, and all kinds of worldgen files.

- [Installation](#installation)
  - [For Use](#for-use)
    - [Sublime Text 3](#sublime-text-3)
    - [Visual Studio Code](#visual-studio-code)
  - [For Developers](#for-developers)
- [Contributors](#contributors)
  - [Contributors for 3.0.0](#contributors-for-300)
  - [Contributors for older versions](#contributors-for-older-versions)
  - [Contributing](#contributing)

# Installation

## For Use

### Sublime Text 3

1. Install [Node.js](https://nodejs.org/) if you haven't.
2. Execute `npm i -g @spgoding/datapack-language-server` in your command line to install the language server.
3. Install [Package Control](https://packagecontrol.io/installation) if you haven't.
4. Install [Arcensoth](https://github.com/Arcensoth)'s language-mcfunction package by following the [instructions](https://github.com/Arcensoth/language-mcfunction#installing-the-sublimetext-package) if you haven't.
5. Install [LSP](https://packagecontrol.io/packages/LSP) package.
6. Open the Command Palette and select `Preferences: LSP Settings`.
7. Configure LSP to add the Data-pack Language Server. Here's one example:
```json
{
  "clients": {
    "datapack-language-server": {
      "command": [
        "datapack-language-server",
        "--stdio"
      ],
      "enabled": true,
      "languages": [
        {
          "languageId": "mcfunction",
          "scopes": [
            "source.mcfunction"
          ],
          "syntaxes": [
            "Packages/language-mcfunction/mcfunction.tmLanguage"
          ]
        },
        {
          "languageId": "json",
          "scopes": [
            "source.json"
          ],
          "syntaxes": [
            "Packages/JavaScript/JSON.sublime-syntax"
          ]
        }
      ]
    }
  },
  "only_show_lsp_completions": true
}
```
8. Open the Command Palette, select `LSP: Enable Language Server Globally`, and choose `datapack-language-server`.
9. Enjoy. Do note that you need to execute the command in step 2 manually if you want to update the language server.

- TODO (for SPGoding): make a fine-tuned Sublime package, so that the language server can be updated automatically and the user doesn't need to set all these crazy stuff.

### Visual Studio Code

We have a ready-for-use [VS Code](https://code.visualstudio.com/) extension: [![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)

## For Developers

See our [wiki](https://github.com/SPGoding/datapack-language-server/wiki/Language%20Server%20Details) for more information.

Also please note that _only_ the `DatapackLanguageService` class and its methods are considered as public API. _All_ other
exported classes/functions/variables, including but not limited to _everything_ under the `nodes` directory, are not part 
of the public API and are subject to change breakingly in even patch/minor versions. _Do not_ make your systems depend on 
them.

# Contributors

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

## Contributors for 3.0.0

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=2113976"><img src="https://www.mcbbs.net/uc_server/data/avatar/002/11/39/76_avatar_big.jpg" width="64px;" alt=""/><br /><sub><b>AOOAcat</b></sub></a></td><td align="left"><a href="https://github.com/SPGoding/datapack-language-server/issues/724" target="_blank" title="Bug reports">🐛 #724</a></td>
    <td align="center"><a href="https://github.com/Arcensoth"><img src="https://avatars2.githubusercontent.com/u/1885643?s=460&u=6c40bfd2701329a442810831d3a2cf954c8cf5de&v=4" width="64px;" alt=""/><br /><sub><b>Arcensoth</b></sub></a></td><td align="left"><a href="https://github.com/Arcensoth/mcdata" target="_blank" title="Dependency">⬆️ Maintains mcdata repository</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/ChenCMD"><img src="https://avatars2.githubusercontent.com/u/46134240?s=460&u=ca934b86e5189ea9c598a51358571e777e21aa2f&v=4" width="64px;" alt=""/><br /><sub><b>ChenCMD</b></sub></a></td><td align="left"><a href="https://github.com/SPGoding/datapack-language-server/issues?q=author%3AChenCMD" target="_blank" title="Collaborator of the Project">💎 Collaborator</a></td>
    <td align="center"><a href="https://github.com/Ghoulboy78"><img src="https://avatars1.githubusercontent.com/u/53367549?s=460&v=4" width="64px;" alt=""/><br /><sub><b>Ghoulboy</b></sub></a></td><td align="left"><a href="https://github.com/SPGoding/datapack-language-server/commits?author=Ghoulboy78" target="_blank" title="Localization">🌐 Italian (it)</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://afdian.net/@k_bai"><img src="https://pic1.afdiancdn.com/user/f34c5d62954411e8948a52540025c377/avatar/a08952a177bcf9aa806e710c0d695dc3_w719_h720_s657.jpg?imageView2/1/w/240/h/240" width="64px;" alt=""/><br /><sub><b>K_bai</b></sub></a></td><td align="left"><a href="https://github.com/sponsors/SPGoding" target="_blank" title="Financial support">☕ Coffee</a></td>
    <td align="center"><a href="https://github.com/misode"><img src="https://avatars1.githubusercontent.com/u/17352009?s=460&u=2813225036a78ea0c585fa5f9150d448c3a8ff8e&v=4" width="64px;" alt=""/><br /><sub><b>Misode</b></sub></a></td><td align="left"><a href="https://github.com/misode/minecraft-schemas" target="_blank" title="Dependency">⬆️ Maintains minecraft-schemas repository</a><br><a href="https://github.com/SPGoding/datapack-language-server/pull/711" target="_blank" title="Code">💻 #711</a><br><a href="https://github.com/SPGoding/datapack-language-server/issues/445" target="_blank" title="Ideas, Planning, and Feedback">✨ #445</a><br><a href="https://github.com/SPGoding/datapack-language-server/issues/592" target="_blank" title="Bug reports">🐛 #592</a><br><a href="https://github.com/SPGoding/datapack-language-server/issues/593" target="_blank" title="Bug reports">🐛 #593</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/NeunEinser"><img src="https://avatars3.githubusercontent.com/u/12124394?s=460&v=4" width="64px;" alt=""/><br /><sub><b>NeunEinser</b></sub></a></td><td align="left"><a href="https://github.com/SPGoding/datapack-language-server/commits?author=NeunEinser" target="_blank" title="Localization">🌐 German (de)</a><br><a href="https://github.com/SPGoding/datapack-language-server/issues/652" target="_blank" title="Bug reports">🐛 #652</a><br><a href="https://github.com/SPGoding/datapack-language-server/issues/653" target="_blank" title="Bug reports">🐛 #653</a><br><a href="https://github.com/SPGoding/datapack-language-server/issues/654" target="_blank" title="Bug reports">🐛 #654</a><br><a href="https://github.com/SPGoding/datapack-language-server/issues/661" target="_blank" title="Bug reports">🐛 #661</a></td>
    <td align="center"><a href="https://github.com/Yurihaia"><img src="https://avatars3.githubusercontent.com/u/17830663?s=400&u=4959d74e027642f5a207dcd5e112005c5932b844&v=4" width="64px;" alt=""/><br /><sub><b>Yurihaia</b></sub></a></td><td align="left"><a href="https://github.com/Yurihaia/mc-nbtdoc" target="_blank" title="Dependency">⬆️ Maintains mc-nbtdoc repository</a></td>
  </tr>
  <tr>
    <td align="center"><a href=""><img src="https://cdn.discordapp.com/avatars/485428324638916608/c10510b1dfa7a8174f3a1001618cafa9.webp?size=256" width="64px;" alt=""/><br /><sub><b>boon4681</b></sub></a></td><td align="left"><a href="https://github.com/SPGoding/datapack-language-server/issues/681" target="_blank" title="Bug reports">🐛 #681</a></td>
    <td align="center"><a href="https://github.com/eke0909"><img src="https://avatars0.githubusercontent.com/u/50884607?s=400&v=4" width="64px;" alt=""/><br /><sub><b>eke0909</b></sub></a></td><td align="left"><a href="https://github.com/SPGoding/datapack-language-server/issues/700" target="_blank" title="Bug reports">🐛 #700</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.mcbbs.net/home.php?mod=space&uid=10240"><img src="https://www.mcbbs.net/uc_server/avatar.php?uid=10240&size=middle" width="64px;" alt=""/><br /><sub><b>kakagRou</b></sub></a></td><td align="left"><a href="https://github.com/sponsors/SPGoding" target="_blank" title="Financial support">☕ Coffee</a></td>
    <td align="center"><a href="https://github.com/lakejason0"><img src="https://avatars1.githubusercontent.com/u/36039861?s=460&v=4" width="64px;" alt=""/><br /><sub><b>lakejason0</b></sub></a></td><td align="left"><a href="https://github.com/SPGoding/datapack-language-server/commits?author=lakejason0" target="_blank" title="Localization">🌐 Chinese (Traditional) (zh-tw)</a><br><a href="https://github.com/SPGoding/datapack-language-server/issues/655" target="_blank" title="Bug reports">🐛 #655</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/mathaym25"><img src="https://avatars2.githubusercontent.com/u/35702771?s=460&u=393d01acff13df6e83beb953bd6f916f514f5141&v=4" width="64px;" alt=""/><br /><sub><b>mathaym25</b></sub></a></td><td align="left"><a href="https://github.com/SPGoding/datapack-language-server/issues/434" target="_blank" title="Bug reports">🐛 #434</a></td>
    <td align="center"><a href="https://github.com/pca006132"><img src="https://avatars3.githubusercontent.com/u/12198657?s=460&v=4" width="64px;" alt=""/><br /><sub><b>pca006132</b></sub></a></td><td align="left"><a href="https://github.com/SPGoding/datapack-language-server/issues/605" target="_blank" title="Ideas, Planning, and Feedback">✨ #605</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/shurik204"><img src="https://avatars2.githubusercontent.com/u/43310372?s=460&u=91bc2eb7213cd4580be5de984f7f920397217103&v=4" width="64px;" alt=""/><br /><sub><b>shurik204</b></sub></a></td><td align="left"><a href="https://github.com/SPGoding/datapack-language-server/issues/678" target="_blank" title="Bug reports">🐛 #678</a></td>
    <td align="center"><a href=""><img src="https://cdn.discordapp.com/avatars/107952648312860672/c168fcedcbfebe58bf14034920945d7a.webp?size=256" width="64px;" alt=""/><br /><sub><b>Ξи</b></sub></a></td><td align="left"><a href="https://github.com/SPGoding/datapack-language-server/issues/660" target="_blank" title="Bug reports">🐛 #660</a><br><a href="https://github.com/SPGoding/datapack-language-server/issues/660" target="_blank" title="Bug reports">🐛 #671</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## Contributors for older versions

- [1.0.0](./contributors/1.0.0.md)
- [2.0.0](./contributors/2.0.0.md)
- [2.1.0](./contributors/2.1.0.md)

## Contributing

If you'd like to contribute, check [CONTRIBUTING.md](./CONTRIBUTING.md) for more information.
