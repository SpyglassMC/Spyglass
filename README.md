# SPYGlass

<div align="center"><img src="https://raw.githubusercontent.com/SPYGlassMC/logo/main/banner.png" height="256px"></div>

🚧 Under construction 🚧

## Packages

- `@spyglassmc/core`: The core package containing plugin API and general framework.
- `@spyglassmc/nbtdoc`: The package providing language features for [nbtdoc][nbtdoc].
- `@spyglassmc/language-server`: The language server wrapped around other packages.
- `@spyglassmc/vscode-extension`: The VS Code extension implemented based on the language server.

## Contributing

1. ```shell
	$ git clone https://github.com/SPYGlassMC/SPYGlass.git --recursive
	```
	or
	```shell
	$ git clone https://github.com/SPYGlassMC/SPYGlass.git && git submodule update --init
	```
2. Make sure you're using an npm version higher than or equal to 7.0.0, as this repository utilizes npm@7's workspaces feature.
   ```shell
	$ npm -v
	$ npm i -g npm@7 # Run this to update it if it's not already 7.x.x.
	```
3. ```shell
	$ npm i && npm run build
	```

If you're using VS Code to develop SPYGlass:

- Install the recommended [ESLint extension][eslint-extension]. Make a copy of `.vscode/settings.template.json` and rename it to `.vscode/settings.json`.
  Now your VS Code should automatically fix all linting errors every time you save the file.
- Press F5 to run the VS Code extension in development environment. VS Code will automatically compile all packages and build the extension file in watch mode.

Or if you prefer the command line interface:

- `npm run build` to build all packages.
- `npm run watch` to watch changes and build all packages.
- `npm run clean` to remove all js output. Use this when there seem to be caching issues with TypeScript's compiler.
- `npm test` to test all packages.
- `npm run lint` to check linting errors.
- `npm run lint:fix` to fix all auto-fixable linting errors.
- `npm run commit` to run the [`gitmoji` CLI][gitmoji]. You actually don't have to worry about commit message as long as you're creating PR, as I can always change it.

Please refrain from using `mocha --watch`, as it might interface with and break the snapshot testing.

[eslint-extension]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
[misode]: https://github.com/misode
[nbtdoc]: https://github.com/Yurihaia/nbtdoc-rs
