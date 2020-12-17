# SPYGlass

<div align="center"><img src="https://raw.githubusercontent.com/SPYGlassMC/logo/main/banner.png" height="256px"></div>

🚧 Under construction 🚧

## Packages

- `@spyglassmc/core`: The core package containing plugin API and general framework.
- `@spyglassmc/mcfunction`: The `mcfunction` parser and interpreter.
- `@spyglassmc/snbt`: The SNBT parser.
- `@spyglassmc/json`: The JSON validator based on [Misode][misode]'s [mcschema][mcschema] structure.
- `@spyglassmc/datapack-language-server`: The language server wrapped around other packages.
- `@spyglassmc/vscode-datapack`: The VS Code extension for editing data packs. Implemented based on the language server.

## Contributing

1. ```shell
	$ git clone https://github.com/SPYGlassMC/SPYGlass.git --recursive
	```
	or
	```shell
	$ git clone https://github.com/SPYGlassMC/SPYGlass.git && git submodule update --init`)
	```
2. ```shell
	$ npm i -g lerna
	```
3. ```shell
	$ lerna bootsrap --hoist
	```

If you're using VS Code to develop SPYGlass, press F5 to run the VS Code extension in development environment.

[misode]: https://github.com/misode
[mcschema]: https://github.com/misode/minecraft-schemas
