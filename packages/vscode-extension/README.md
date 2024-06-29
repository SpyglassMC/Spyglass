# Datapack Helper Plus by Spyglass
<div align="center"><img src="https://raw.githubusercontent.com/SpyglassMC/logo/main/banner.png"></div>

[![Discord](https://img.shields.io/discord/666020457568403505?logo=discord&style=flat-square)](https://discord.gg/EbdseuS)
[![VSCode Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![VSCode Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![VSCode Marketplace Rating](https://img.shields.io/visual-studio-marketplace/stars/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![License](https://img.shields.io/github/license/SpyglassMC/vscode-datapack.svg?style=flat-square)](https://github.com/SPGoding/vscode-datapack-helper-plus/blob/master/LICENSE)

Spyglass aims at improving users' editing experience of Minecraft data packs by providing IntelliSense features like real-time error reporting, auto-completion, semantic coloring, and code navigation tools.

## Features

### Semantic coloring
All command arguments are colored semantically. This extension includes [syntax-mcfunction](https://marketplace.visualstudio.com/items?itemName=MinecraftCommands.syntax-mcfunction) as a dependency, to get instant coloring feedback.
![Semantic coloring example](https://gist.github.com/assets/17352009/44d9aec8-e1ba-46b3-ba56-4f7e3793c1a5)

### Diagnostics
Spyglass provides real-time diagnostics about your commands and JSON files. It can show syntax errors as Minecraft does, and even give your more detailed warnings.

![Diagnostics example](https://gist.github.com/assets/17352009/3cd406f7-eca5-4d07-b144-99f00a380f40)

### Code completions
The extension can compute completions as you typing commands. Completions will automatically show when typing certain characters. Alternatively you can use Ctrl + Space (or other configured hotkey) to show completions manually.
![Completions in an NBT tag](https://gist.github.com/assets/17352009/c89d7ff2-72b4-4b0a-b6b5-2ff378ceb060)
![Completions in a loot table file](https://gist.github.com/assets/17352009/d856b154-718d-4794-a19d-2f94eb67edb9)

### Definition links
You can navigate to functions, advancements, loot tables, and other resources by Ctrl-clicking on their namespaced IDs. This even works for vanilla resources.
![Document links example](https://gist.github.com/assets/17352009/fc44f3be-5727-4be1-95ed-ce6478026316)

### Peek references
You can find all the references of objectives, tags, data storages, functions, and other resources in the workspace by pressing Shift + F12 or other configured key.
![image](https://gist.github.com/assets/17352009/c731d0d3-56ae-4826-b02d-e834c59fff93)

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

Additionally, thanks to all the translators and bug reporters!

The original Spyglass logo was provided by [BlackNight0315](https://github.com/BlackNight0315).
The current logo is provided by [asd988](https://github.com/asd988).
