# `@spyglassmc/nbtdoc`

![banner](https://raw.githubusercontent.com/SPYGlassMC/logo/main/banner.png)

[![npm](https://img.shields.io/npm/v/@spyglassmc/nbtdoc.svg?logo=npm&style=flat-square)](https://npmjs.com/package/@spyglassmc/nbtdoc)

This package contains parsers and processors for [the `nbtdoc` language][nbtdoc-format] designed by [Yurihaia][yurihaia].

# Contributions

## Languages

- `nbtdoc` language that is associated with the `.nbtdoc` file extension. The implementation strictly follows the [NBTDoc Format][nbtdoc-format]

## AST Nodes

- `nbtdoc:main`
	- `nbtdoc:compound_definition`
	- `nbtdoc:enum_definition`
	- `nbtdoc:module_declaration`
	- `nbtdoc:use_clause`
	- `nbtdoc:describe_clause`
	- `nbtdoc:inject_clause`

## Processors

### Validators

[nbtdoc-format]: https://github.com/Yurihaia/nbtdoc-rs/blob/master/docs/format.md
[yurihaia]: https://github.com/Yurihaia
