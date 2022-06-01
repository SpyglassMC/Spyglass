/*
 * A series of functions that can transform `vscode-languageserver` types to `@spyglassmc/core` types.
 * 
 * Functions are named after types in `@spyglassmc/core`.
 */

import * as core from '@spyglassmc/core'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import type * as ls from 'vscode-languageserver/node.js'

export function offset(position: ls.Position, doc: TextDocument): number {
	return doc.offsetAt(position)
}

export function range(range: ls.Range, doc: TextDocument): core.Range {
	return core.Range.create(offset(range.start, doc), offset(range.end, doc))
}

export function color(color: ls.Color): core.Color {
	return [color.red, color.green, color.blue, color.alpha]
}
