# Spyglass VS Code Extension

## Module system

The whole Spyglass project, including its source code and output, uses ES module.
However, as VS Code cannot consume ES modules as extensions ([microsoft/vscode#130367](https://github.com/microsoft/vscode/issues/130367)),
this package defaults to use CommonJS modules, with file extensions `mjs` and `mts` to explicitly override that,
