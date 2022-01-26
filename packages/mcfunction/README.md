# `@spyglassmc/mcfunction`

![banner](https://raw.githubusercontent.com/SpyglassMC/logo/main/banner.png)

[![npm](https://img.shields.io/npm/v/@spyglassmc/mcfunction.svg?logo=npm&style=flat-square)](https://npmjs.com/package/@spyglassmc/mcfunction)

This package contains parsers and processors for [mcfunction][mcfunction].

# Usage

```typescript
import * as mcf from '@spyglassmc/mcfunction'

// Register the command tree for a specific version.
mcf.CommandTreeRegistry.instance.register('1.15', vanillaCommandTreeFor1_15, customCommandTreePatchFor1_15)

// Define a function that returns the corresponding parser for the provided argument tree node.
const argument: mcf.parser.ArgumentParserGetter = (treeNode: mcf.ArgumentTreeNode) => {
	switch (treeNode.parser) {
		case 'brigadier:double':
			return parser1
		case 'brigadier:int':
			return parser2
		// ...
		default:
			// Unsupported parser.
			// Just return `undefined`.
			return undefined
	}
}

// Get the command parser.
const commandParser = mcf.parser.command('1.15', argument)

// Or the mcfunction parser.
const mcfunctionParser = mcf.parser.entry('1.15', argument)
```

# Contributions

## Languages

- `mcfunction` language that is associated with the `.mcfunction` file extension.

## AST Nodes

## Processors

[mcfunction]: https://minecraft.fandom.com/Function_(Java_Edition)
