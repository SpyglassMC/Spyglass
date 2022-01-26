# `@spyglassmc/java-edition`

![banner](https://raw.githubusercontent.com/SpyglassMC/logo/main/banner.png)

[![npm](https://img.shields.io/npm/v/@spyglassmc/java-edition.svg?logo=npm&style=flat-square)](https://npmjs.com/package/@spyglassmc/java-edition)

This package provides support for [_Minecraft: Java Edition_][java-edition] map making.

# mcfunction

## Usage

1. Register vanilla command trees and command tree patches to `CommandTreeRegistry`.
```typescript
CommandTreeRegistry.instance.register('1.15', vanillaCommandTreeFor1_15)
CommandTreeRegistry.instance.register('1.16', vanillaCommandTreeFor1_16)
CommandTreeRegistry.instance.register('1.17', vanillaCommandTreeFor1_17)

CommandTreeRegistry.instance.register('1.17-tdn', vanillaCommandTreeFor1_17, tridentCommandTreePatchFor1_17)
```
2. // TODO

## Exported Parsers

- `mcfunction:block_predicate`
- `mcfunction:command`
- `mcfunction:component`
- `mcfunction:particle` // TODO
- `mcfunction:tag`
- `mcfunction:team`

[java-edition]: https://minecraft.fandom.com/Java_Edition
