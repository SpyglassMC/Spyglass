import type * as ls from 'vscode-languageserver/node'

export interface CustomServerCapabilities {
	dataHackPubify?: boolean,
	inlayHints?: boolean,
	showCacheRoot?: boolean,
}

export interface MyLspDataHackPubifyRequestParams {
	initialism: string,
}

export interface MyLspInlayHint {
	position: ls.Position,
	text: string,
}

export interface MyLspInlayHintRequestParams {
	textDocument: {
		uri: string,
	},
	range: ls.Range,
}
