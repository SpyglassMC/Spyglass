# Spyglass

<div align="center"><img src="https://raw.githubusercontent.com/SpyglassMC/logo/main/banner.png"></div>

Spyglass aims at improving users' editing experience of Minecraft data packs by providing IntelliSense features like
real-time error reporting, auto-completion, semantic coloring, code navigation tools, and refactor utilities.

![Completions in an NBT tag](https://raw.githubusercontent.com/SpyglassMC/Spyglass/main/packages/vscode-extension/img/nbt-tag-completions.gif)

## Documentation

WIP at https://spyglassmc.com.

## Contributing

1. ```shell
	$ git clone https://github.com/SpyglassMC/Spyglass.git
	```
2. Install [Node.js LTS](https://nodejs.org/en/).
3. ```shell
	$ npm i && npm run build
	```

If you're using VS Code to develop Spyglass:

- Install the recommended [ESLint extension][eslint-extension]. Make a copy of `.vscode/settings.template.json` and rename it to `.vscode/settings.json`.
  Now your VS Code should automatically fix all linting errors every time you save the file.
- Press F5 to run the VS Code extension in development environment (`Launch Client`). VS Code will automatically compile all packages and build the extension file in watch mode.

Or if you prefer the command line interface:

- `npm run build` to build all packages.
- `npm run watch` to watch changes and build all packages.
- `npm run clean` to remove all js output. Use this when there seem to be caching issues with TypeScript's compiler.
- `npm test` to test all packages.
- `npm run lint` to check linting errors.
- `npm run lint:fix` to fix all auto-fixable linting errors.
- `npm run commit` to run the [`gitmoji` CLI][gitmoji]. You actually don't have to worry about commit message as long as you're creating PR, as I can always change it.

Please refrain from using `mocha --watch`, as it might interface with and break the snapshot testing.

You can debug tests with breakpoints by running the `Run Unit Tests` configuration and setting your breakpoints accordingly. If you want to run a specific subset of tests, add `.only` after the test block (e.g. `describe.only()`, `it.only()`).

Note that the build will fail in CICD if `.only` tests are pushed to prevent mistakenly merging `.only` to `main` (it should only be used for local testing!).

### Code style

Tabs for indents, spaces for alignment. Except do not align things because the available tooling is unfortunately terrible.

### Test docs locally

1. Install Jekyll according to [its documentation](https://jekyllrb.com/docs/#instructions).
2. Run `npm run docs:start` to start a local preview at `localhost:4000`.

### Build Pipeline

The `build` script at the root level does the following steps in series:

* Run the `build` script in `./packages/locales`.
* Run the TypeScript compiler across all packages.
* Then, do the two steps in parallel:
	1. Run the `build` script in `./packages/playground`.
	2. Run the `build` script in `./packages/vscode-extension`.

### Module system

The whole Spyglass project, including its source code and output, uses ES module.
However, as VS Code cannot consume ES modules as extensions ([microsoft/vscode#130367](https://github.com/microsoft/vscode/issues/130367)),
the `vscode-extension` package defaults to use CommonJS modules, with file extensions `mjs` and `mts` to explicitly override that,

## Credits

The original Spyglass logo was provided by [BlackNight0315](https://github.com/BlackNight0315).
The current logo is provided by [asd988](https://github.com/asd988).

[eslint-extension]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
