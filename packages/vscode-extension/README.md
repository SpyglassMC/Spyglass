# Datapack Helper Plus by Spyglass
<div align="center"><img src="https://raw.githubusercontent.com/SpyglassMC/logo/main/banner.png"></div>

[![Discord](https://img.shields.io/discord/666020457568403505?logo=discord&style=flat-square)](https://discord.gg/EbdseuS)
[![VSCode Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![VSCode Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![VSCode Marketplace Rating](https://img.shields.io/visual-studio-marketplace/stars/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![License](https://img.shields.io/github/license/SpyglassMC/vscode-datapack.svg?style=flat-square)](https://github.com/SPGoding/vscode-datapack-helper-plus/blob/master/LICENSE)

Spyglass aims at improving users' editing experience of Minecraft data packs by providing IntelliSense features like real-time error reporting, auto-completion, semantic coloring, and code navigation tools.

## Configuration
> Full documentation: https://spyglassmc.com/user/config

By default, Spyglass will look for a `pack.mcmeta` file containing a `pack_format` value. The Minecraft release version matching that pack format will be used to determine the vanilla data pack, validation schemas for JSON and NBT, command-specific checks, etc.

If you wish to override the detected version, for example when working in multi-version packs, create a `spyglass.json` file at the workspace root containing:
```json
{
   "env": {
      "gameVersion": "1.20.6"
   }
}
```

If you want resource location completions to always include the default `minecraft:` namespace, use the following config:
```json
{
   "lint": {
		"idOmitDefaultNamespace": false
   }
}
```

## Features

### Semantic coloring
All command arguments are colored semantically. This extension includes [syntax-mcfunction](https://marketplace.visualstudio.com/items?itemName=MinecraftCommands.syntax-mcfunction) as a dependency to get instant coloring feedback.

![Semantic coloring example](https://raw.githubusercontent.com/SpyglassMC/Spyglass/main/packages/vscode-extension/img/semantic-coloring.png)

### Diagnostics
Spyglass provides real-time diagnostics about your commands and JSON files. It can show syntax errors as Minecraft does, and even give you more detailed warnings.

![Diagnostics example](https://raw.githubusercontent.com/SpyglassMC/Spyglass/main/packages/vscode-extension/img/diagnostics.gif)

### Code completions
The extension can compute completions as you type commands. Completions will automatically show when typing certain characters. Alternatively you can use Ctrl + Space (or other configured hotkey) to show completions manually.

![Completions in an NBT tag](https://raw.githubusercontent.com/SpyglassMC/Spyglass/main/packages/vscode-extension/img/nbt-tag-completions.gif)
![Completions in an NBT path](https://raw.githubusercontent.com/SpyglassMC/Spyglass/main/packages/vscode-extension/img/nbt-path-completions.gif)
![Completions in a loot table file](https://raw.githubusercontent.com/SpyglassMC/Spyglass/main/packages/vscode-extension/img/loot-table-completions.gif)

### Definition links
You can navigate to functions, advancements, loot tables, and other resources by Ctrl-clicking on their namespaced IDs. This even works for vanilla resources.

![Document links example](https://raw.githubusercontent.com/SpyglassMC/Spyglass/main/packages/vscode-extension/img/document-link.gif)

### Peek references
You can find all the references of objectives, tags, data storages, functions, and other resources in the workspace by pressing Shift + F12 or other configured key.

![Peek references example](https://raw.githubusercontent.com/SpyglassMC/Spyglass/main/packages/vscode-extension/img/peek-references.png)

## Commands
> Full documentation: https://spyglassmc.com/user/commands

### Reset project cache
Spyglass uses a cache to speedup the process of validating, finding references/definitions, document links, etc. However the cache may become outdated because of various reasons, which could lead to strange behaviors. You can use the `Spyglass: Reset Project Cache` command to regenerate the cache manually. You can open the command prompt using Ctrl+Shift+P (or other configured hotkey).

### Open cache folder
If you are still experiencing problems after running the above command, you can navigate to the cache folder by using the `Spyglass: Open Cache Folder` command and wiping the folder. This removes the downloaded vanilla data pack, project caches, etc.

## Credits
This extension is only possible thanks to all the contributors that have worked on this project!

* <img src="https://avatars.githubusercontent.com/u/13565346?v=4&size=12"> [Afro](https://github.com/TheAfroOfDoom)
* <img src="https://avatars.githubusercontent.com/u/38361803?v=4&size=12"> [Calverin](https://github.com/Calverin)
* <img src="https://avatars.githubusercontent.com/u/46134240?v=4&size=12"> [ChenCMD](https://github.com/ChenCMD)
* <img src="https://avatars.githubusercontent.com/u/10163794?v=4&size=12"> [Jacobjso](https://github.com/jacobsjo)
* <img src="https://avatars.githubusercontent.com/u/17352009?v=4&size=12"> [Misode](https://github.com/misode)
* <img src="https://avatars.githubusercontent.com/u/12068027?v=4&size=12"> [Mulverine](https://github.com/MulverineX)
* <img src="https://avatars.githubusercontent.com/u/12124394?v=4&size=12"> [NeunEinser](https://github.com/NeunEinser)
* <img src="https://avatars.githubusercontent.com/u/26015841?v=4" width="12"> [Nicoder](https://github.com/Nico314159)
* <img src="https://avatars.githubusercontent.com/u/15277496?v=4&size=12"> [Spgoding](https://github.com/SPGoding)
* <img src="https://avatars.githubusercontent.com/u/13611030?v=4&size=12"> [Trivaxy](https://github.com/Trivaxy)
* <img src="https://avatars.githubusercontent.com/u/24430071?v=4" width="12"> [Vberlier](https://github.com/vberlier)

Additionally, thanks to all the translators, beta testers, and bug reporters!

The original Spyglass logo was provided by [BlackNight0315](https://github.com/BlackNight0315).
The current logo is provided by [asd988](https://github.com/asd988).
