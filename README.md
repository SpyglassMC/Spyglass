# SPYGlass

<div align="center"><img src="https://raw.githubusercontent.com/SPYGlassMC/logo/main/banner.png" height="256px"></div>

🚧 Under construction 🚧

## Packages

- `@spyglassmc/core`: The core package containing plugin API and general framework.
- `@spyglassmc/mcfunction`: The `mcfunction` parser and interpreter.
- `@spyglassmc/snbt`: The SNBT parser.
- `@spyglassmc/json`: The JSON validator based on [Misode][misode]'s [mcschema][mcschema] structure.
- `@spyglassmc/language-server`: The language server wrapped around other packages.
- `@spyglassmc/vscode-extension`: The VS Code extension implemented based on the language server.

## Contributing

1. ```shell
	$ git clone https://github.com/SPYGlassMC/SPYGlass.git --recursive
	```
	or
	```shell
	$ git clone https://github.com/SPYGlassMC/SPYGlass.git && git submodule update --init`)
	```
2. ```shell
	$ npm run init
	```

If you're using VS Code to develop SPYGlass:

- Press F5 to run the VS Code extension in development environment.
- Install the recommended [ESLint extension][eslint-extension]. Many linting errors can be fixed automatically when you save the file.

Please refrain from using `mocha --watch`, as it might interface with and break the snapshot testing.

[eslint-extension]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
[misode]: https://github.com/misode
[mcschema]: https://github.com/misode/minecraft-schemas
