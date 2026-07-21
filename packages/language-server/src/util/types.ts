import type { AnalyzeProjectResult, PartialConfig } from '@spyglassmc/core'

export interface CustomInitializationOptions {
	inDevelopmentMode?: boolean
	defaultConfig?: PartialConfig
}

export interface CustomServerCapabilities {
	analyzeProject?: boolean
	dataHackPubify?: boolean
	resetProjectCache?: boolean
	showCacheRoot?: boolean
}

export interface MyLspDataHackPubifyRequestParams {
	initialism: string
}

/**
 * Response of the `spyglassmc/analyzeProject` request. `undefined` is responded instead if an
 * analysis is already in progress.
 */
export type MyLspAnalyzeProjectResult = AnalyzeProjectResult
