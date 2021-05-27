import * as core from '@spyglassmc/core'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import type * as ls from 'vscode-languageserver/node'
import { toLS } from './toLS'

/**
 * A series of functions that can transform `vscode-languageserver` types to `@spyglassmc/core` types.
 * 
 * Functions are named after types in `@spyglassmc/core`.
 */
export namespace toCore {
	export function errorPublisher(connection: ls.Connection): core.ErrorPublisher {
		const ans: core.ErrorPublisher = (target, errors) => {
			if (typeof target === 'string') {
				connection.sendDiagnostics({ uri: target, diagnostics: [] })
			} else {
				connection.sendDiagnostics({
					uri: target.uri,
					diagnostics: toLS.diagnostics(errors ?? [], target),
					version: target.version,
				})
			}
		}
		return ans
	}

	export function offset(position: ls.Position, doc: TextDocument): number {
		return doc.offsetAt(position)
	}

	export function range(range: ls.Range, doc: TextDocument): core.Range {
		return core.Range.create(offset(range.start, doc), offset(range.end, doc))
	}

	export function color(color: ls.Color): core.Color {
		return [color.red, color.green, color.blue, color.alpha]
	}
}
