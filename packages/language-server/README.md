# `@spyglassmc/language-server`

![banner](https://raw.githubusercontent.com/SPYGlassMC/logo/main/banner.png)

[![npm](https://img.shields.io/npm/v/datapack-language-server.svg?logo=npm&style=flat-square)](https://npmjs.com/package/datapack-language-server)

This is a [language server][lsp] wrapped around some other SPYGlass packages.

- [Installation](#installation)
	- [For Use](#for-use)
		- [Sublime Text 3](#sublime-text-3)
		- [Visual Studio Code](#visual-studio-code)
	- [For Developers](#for-developers)

# Installation

## For Use

### Sublime Text 3

1. Install [Node.js](https://nodejs.org/) if you haven't.
2. Execute `npm i -g @spyglassmc/language-server` in your command line to install the language server.
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

See our [wiki](https://spyglassmc.com/wiki/Language-Server-Details) for more information.

[lsp]: https://microsoft.github.io/language-server-protocol/
