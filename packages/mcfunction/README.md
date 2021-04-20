# `@spyglassmc/mcfunction`

![banner](https://raw.githubusercontent.com/SPYGlassMC/logo/main/banner.png)

[![npm](https://img.shields.io/npm/v/@spyglassmc/mcfunction.svg?logo=npm&style=flat-square)](https://npmjs.com/package/@spyglassmc/mcfunction)

This package contains parsers amd processors for [mcfunction][mcfunction].

# Usage

1. Register vanilla command trees and command tree patches to `CommandTreeRegistry`.
```typescript
CommandTreeRegistry.instance.register('1.15', vanillaCommandTreeFor1_15)
CommandTreeRegistry.instance.register('1.16', vanillaCommandTreeFor1_16)
CommandTreeRegistry.instance.register('1.17', vanillaCommandTreeFor1_17)

CommandTreeRegistry.instance.register('1.17-tdn', vanillaCommandTreeFor1_17, tridentCommandTreePatchFor1_17)
```
2. // TODO

# Contributions

## Languages

- `mcfunction` language that is associated with the `.mcfunction` file extension.

## AST Nodes

## Processors

[mcfunction]: https://minecraft.fandom.com/Function_(Java_Edition)
