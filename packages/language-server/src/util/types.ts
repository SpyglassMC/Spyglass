import type * as ls from 'vscode-languageserver/node'

export interface MyLsInlayHint {
	position: ls.Position,
	text: string,
}

export interface MyLsInlayHintRequestParams {
	textDocument: {
		uri: string,
	},
	range: ls.Range,
}
