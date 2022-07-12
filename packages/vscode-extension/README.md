# Spyglass VS Code Extension

## Module system

The whole Spyglass project, including its source code and output, uses ES module.
Except for the `dist` output of the `vscode-extension` package, as VS Code cannot consume ES modules as extensions ([microsoft/vscode#130367](https://github.com/microsoft/vscode/issues/130367)).
