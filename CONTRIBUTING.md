# Ways to Contribute

## 🐛 Bugs & 🤔 Ideas

Feel free to [open an issue](https://github.com/SpyglassMC/Spyglass/issues/new) to report a bug or share us your great ideas!

Please only put one bug/suggestion in each issue to make it easier to track, and provide helpful information (like the commands you wrote, the errors it showed) to help reproduce and fix.

## 🌐 Translation

[![Localization status](https://weblate.spyglassmc.com/widgets/spyglass/-/multi-auto.svg)](https://weblate.spyglassmc.com/engage/spyglass/?utm_source=widget)

Spyglass supports multiple languages. If you'd like to help us translate this project to your language, it would be really appreciated!

### Steps

1. Go to the [localization website](https://weblate.spyglassmc.com).
2. [Register](https://weblate.spyglassmc.com/accounts/register) by linking your GitHub account (recommended), or using your email.
3. See two components of Spyglass [here](https://weblate.spyglassmc.com/projects/spyglass).
4. Start translating!

### Note

- If your language is not listed on the platform, simply [open an issue](https://github.com/SpyglassMC/Spyglass/issues/new).
- If you have suggestions for the source string (`en-us`), please [open an issue](https://github.com/SPGoding/datapack-language-server/issues/new), or discuss with other translators at the [Discord server](https://discord.gg/EbdseuS) if you'd like to.

## 💰 Sponsor

Some team members accept donations. If you're interested in sponsoring, you can go to their GitHub Sponsors pages:
- [SPGoding](https://github.com/sponsors/SPGoding)
- [Misode](https://github.com/sponsors/misode)
- [MulverineX](https://github.com/sponsors/MulverineX)
- [jacobsjo](https://github.com/sponsors/jacobsjo)

## 💻 Developing

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
- Press F5 to run the VS Code extension in development environment (`Server + Client`). VS Code will automatically compile all packages and build the extension file in watch mode.

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

[eslint-extension]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
